import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@13?target=deno';

type ServiceClient = ReturnType<typeof createServiceClient>;

type CheckoutCourse = {
  id: string;
  price: number;
  sale_price: number | null;
  students_count: number;
};

type AuthenticatedUser = {
  id: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
};

type RefundOrderItem = {
  course_id: string;
};

export type RefundableOrder = {
  id: string;
  user_id: string;
  status: string;
  stripe_payment_intent_id: string | null;
  stripe_refund_id: string | null;
  refunded_at: string | null;
  order_items: RefundOrderItem[] | null;
};

type FinalizeCheckoutResult = {
  orderId: string;
  insertedEnrollmentCount: number;
};

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export function getRequiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing ${name} for checkout configuration.`);
  }
  return value;
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object') {
    const message = 'message' in error && typeof error.message === 'string'
      ? error.message
      : null;
    const details = 'details' in error && typeof error.details === 'string'
      ? error.details
      : null;
    const hint = 'hint' in error && typeof error.hint === 'string'
      ? error.hint
      : null;

    return [message, details, hint].filter(Boolean).join(' ').trim() || 'Unknown checkout error';
  }

  return 'Unknown checkout error';
}

export function createStripeClient() {
  return new Stripe(getRequiredEnv('STRIPE_SECRET_KEY'), {
    apiVersion: '2023-10-16',
  });
}

export function createServiceClient() {
  return createClient(
    getRequiredEnv('SUPABASE_URL'),
    getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
  );
}

function normalizeRole(role: unknown) {
  return typeof role === 'string' ? role.trim().toLowerCase() : '';
}

function getMetadataRole(user: AuthenticatedUser | null) {
  if (!user) return '';

  const roleCandidates = [
    user.app_metadata?.role,
    user.app_metadata?.user_role,
    user.user_metadata?.role,
    user.user_metadata?.user_role,
  ];

  return roleCandidates
    .map(normalizeRole)
    .find(Boolean) ?? '';
}

function getBearerToken(authHeader: string | null) {
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
}

function getCheckoutMetadata(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const rawCourseIds = session.metadata?.course_ids ?? '';
  const courseIds = Array.from(new Set(
    rawCourseIds
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  ));

  return { userId, courseIds };
}

function isUniqueViolation(error: unknown) {
  return Boolean(
    error
    && typeof error === 'object'
    && 'code' in error
    && error.code === '23505',
  );
}

async function getExistingEnrollments(
  supabase: ServiceClient,
  userId: string,
  courseIds: string[],
) {
  const { data, error } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('user_id', userId)
    .in('course_id', courseIds);

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function getCanonicalOrderId(
  supabase: ServiceClient,
  sessionId: string,
) {
  const { data: existingOrders, error } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_checkout_session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  if (!existingOrders || existingOrders.length === 0) {
    return null;
  }

  const [canonicalOrder, ...duplicateOrders] = existingOrders;
  if (duplicateOrders.length === 0) {
    return canonicalOrder.id;
  }

  const duplicateOrderIds = duplicateOrders.map((order) => order.id);

  const { error: deleteOrderItemsError } = await supabase
    .from('order_items')
    .delete()
    .in('order_id', duplicateOrderIds);

  if (deleteOrderItemsError) {
    throw deleteOrderItemsError;
  }

  const { error: deleteOrdersError } = await supabase
    .from('orders')
    .delete()
    .in('id', duplicateOrderIds);

  if (deleteOrdersError) {
    throw deleteOrdersError;
  }

  return canonicalOrder.id;
}

async function incrementStudentCounts(
  supabase: ServiceClient,
  courses: CheckoutCourse[],
  courseIds: string[],
) {
  const courseMap = new Map(courses.map((course) => [course.id, course]));

  for (const courseId of courseIds) {
    const course = courseMap.get(courseId);
    if (!course) continue;

    const { error } = await supabase
      .from('courses')
      .update({ students_count: course.students_count + 1 })
      .eq('id', courseId);

    if (error) {
      throw error;
    }
  }
}

export async function requireAdminUser(
  supabase: ServiceClient,
  authHeader: string | null,
): Promise<AuthenticatedUser> {
  const accessToken = getBearerToken(authHeader);
  if (!accessToken) {
    throw new HttpError(401, 'Missing authorization header.');
  }

  const { data, error: authError } = await supabase.auth.getUser(accessToken);
  const user = data.user as AuthenticatedUser | null;

  if (authError || !user) {
    throw new HttpError(401, 'Unauthorized.');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  const normalizedProfileRole = normalizeRole(profile?.role);
  const isAdmin = normalizedProfileRole === 'admin' || getMetadataRole(user) === 'admin';

  if (!isAdmin) {
    throw new HttpError(403, 'Admin access required.');
  }

  return user;
}

async function getOrderByFilter(
  supabase: ServiceClient,
  filter: { column: 'id' | 'stripe_payment_intent_id'; value: string },
) {
  const query = supabase
    .from('orders')
    .select(`
      id,
      user_id,
      status,
      stripe_payment_intent_id,
      stripe_refund_id,
      refunded_at,
      order_items(course_id)
    `)
    .eq(filter.column, filter.value)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return data as RefundableOrder | null;
}

export async function getRefundableOrderById(
  supabase: ServiceClient,
  orderId: string,
) {
  const order = await getOrderByFilter(supabase, { column: 'id', value: orderId });

  if (!order) {
    throw new HttpError(404, 'Order not found.');
  }

  return order;
}

export async function getRefundableOrderByPaymentIntent(
  supabase: ServiceClient,
  paymentIntentId: string,
) {
  return getOrderByFilter(supabase, {
    column: 'stripe_payment_intent_id',
    value: paymentIntentId,
  });
}

export function assertOrderRefundable(order: RefundableOrder) {
  if (!order.stripe_payment_intent_id) {
    throw new HttpError(400, 'This order does not have a Stripe payment to refund.');
  }

  if (order.status === 'refunded' || order.stripe_refund_id || order.refunded_at) {
    throw new HttpError(409, 'This order has already been refunded.');
  }

  if (order.status !== 'completed') {
    throw new HttpError(409, 'Only completed orders can be refunded.');
  }
}

export async function updateOrderRefundState(
  supabase: ServiceClient,
  orderId: string,
  refundId: string | null,
  refundedAt: string,
) {
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'refunded',
      stripe_refund_id: refundId,
      refunded_at: refundedAt,
    })
    .eq('id', orderId);

  if (error) {
    throw error;
  }
}

async function decrementStudentCounts(
  supabase: ServiceClient,
  deletedEnrollmentCourseIds: string[],
) {
  if (deletedEnrollmentCourseIds.length === 0) {
    return;
  }

  const countsByCourseId = new Map<string, number>();
  for (const courseId of deletedEnrollmentCourseIds) {
    countsByCourseId.set(courseId, (countsByCourseId.get(courseId) ?? 0) + 1);
  }

  const courseIds = Array.from(countsByCourseId.keys());
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, students_count')
    .in('id', courseIds);

  if (coursesError) {
    throw coursesError;
  }

  const courseCountMap = new Map(
    (courses ?? []).map((course) => [course.id, Number(course.students_count ?? 0)]),
  );

  for (const [courseId, removedCount] of countsByCourseId.entries()) {
    const currentCount = courseCountMap.get(courseId) ?? 0;
    const { error: updateError } = await supabase
      .from('courses')
      .update({ students_count: Math.max(0, currentCount - removedCount) })
      .eq('id', courseId);

    if (updateError) {
      throw updateError;
    }
  }
}

export async function revokeOrderEnrollments(
  supabase: ServiceClient,
  order: RefundableOrder,
) {
  const courseIds = Array.from(new Set(
    (order.order_items ?? [])
      .map((item) => item.course_id)
      .filter(Boolean),
  ));

  if (!order.stripe_payment_intent_id || courseIds.length === 0) {
    return 0;
  }

  const { data: deletedEnrollments, error: deleteError } = await supabase
    .from('enrollments')
    .delete()
    .eq('user_id', order.user_id)
    .eq('stripe_payment_intent_id', order.stripe_payment_intent_id)
    .in('course_id', courseIds)
    .select('id, course_id');

  if (deleteError) {
    throw deleteError;
  }

  const deleted = deletedEnrollments ?? [];
  if (deleted.length === 0) {
    return 0;
  }

  await decrementStudentCounts(
    supabase,
    deleted.map((enrollment) => enrollment.course_id),
  );

  return deleted.length;
}

export async function applyRefundToOrder(
  supabase: ServiceClient,
  order: RefundableOrder,
  refundId: string | null,
  refundedAt: string,
) {
  await updateOrderRefundState(supabase, order.id, refundId, refundedAt);
  return revokeOrderEnrollments(supabase, order);
}

export async function finalizeCheckoutSession(
  supabase: ServiceClient,
  session: Stripe.Checkout.Session,
): Promise<FinalizeCheckoutResult> {
  const { userId, courseIds } = getCheckoutMetadata(session);

  if (!userId || courseIds.length === 0) {
    throw new Error('Missing checkout metadata.');
  }

  if (session.payment_status !== 'paid') {
    throw new Error('Checkout session is not paid.');
  }

  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, price, sale_price, students_count')
    .in('id', courseIds);

  if (coursesError) {
    throw coursesError;
  }

  if (!courses || courses.length !== courseIds.length) {
    throw new Error('Unable to find all purchased courses.');
  }

  let orderId = await getCanonicalOrderId(supabase, session.id);

  if (!orderId) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .upsert({
        user_id: userId,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
        amount_total: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? 'usd',
        status: 'completed',
      }, {
        onConflict: 'stripe_checkout_session_id',
      })
      .select('id')
      .single();

    if (orderError) {
      if (!isUniqueViolation(orderError)) {
        throw orderError;
      }

      orderId = await getCanonicalOrderId(supabase, session.id);
    } else if (order) {
      orderId = order.id;
    }

    if (!orderId) {
      throw new Error('Unable to create order.');
    }
  }

  const orderItems = courses.map((course) => ({
    order_id: orderId,
    course_id: course.id,
    price_paid: course.sale_price ?? course.price,
  }));

  if (orderItems.length > 0) {
    const { error: orderItemsError } = await supabase
      .from('order_items')
      .upsert(orderItems, {
        onConflict: 'order_id,course_id',
        ignoreDuplicates: true,
      });

    if (orderItemsError && !isUniqueViolation(orderItemsError)) {
      throw orderItemsError;
    }
  }

  const existingEnrollmentIds = new Set((await getExistingEnrollments(supabase, userId, courseIds)).map((item) => item.course_id));
  const newEnrollmentIds = courseIds.filter((courseId) => !existingEnrollmentIds.has(courseId));

  if (newEnrollmentIds.length > 0) {
    let insertedEnrollmentIds: string[] = [];
    const { error: enrollmentsError } = await supabase
      .from('enrollments')
      .insert(
        newEnrollmentIds.map((courseId) => ({
          user_id: userId,
          course_id: courseId,
          stripe_payment_intent_id: typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id ?? null,
        })),
      );

    if (enrollmentsError) {
      if (!isUniqueViolation(enrollmentsError)) {
        throw enrollmentsError;
      }
    } else {
      insertedEnrollmentIds = newEnrollmentIds;
    }

    if (insertedEnrollmentIds.length > 0) {
      await incrementStudentCounts(supabase, courses as CheckoutCourse[], insertedEnrollmentIds);
    }

    return {
      orderId,
      insertedEnrollmentCount: insertedEnrollmentIds.length,
    };
  }

  return {
    orderId,
    insertedEnrollmentCount: newEnrollmentIds.length,
  };
}
