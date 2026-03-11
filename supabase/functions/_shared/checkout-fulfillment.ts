import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@13?target=deno';

type CheckoutCourse = {
  id: string;
  price: number;
  sale_price: number | null;
  students_count: number;
};

type FinalizeCheckoutResult = {
  orderId: string;
  insertedEnrollmentCount: number;
};

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
  supabase: ReturnType<typeof createServiceClient>,
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
  supabase: ReturnType<typeof createServiceClient>,
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
  supabase: ReturnType<typeof createServiceClient>,
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

export async function finalizeCheckoutSession(
  supabase: ReturnType<typeof createServiceClient>,
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
