import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@13?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const courseIdsStr = session.metadata?.course_ids;

    if (!userId || !courseIdsStr) {
      return new Response('Missing metadata', { status: 400 });
    }

    const courseIds = courseIdsStr.split(',');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch courses to get prices
    const { data: courses } = await supabase
      .from('courses')
      .select('id, price, sale_price')
      .in('id', courseIds);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        amount_total: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? 'usd',
        status: 'completed',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Failed to create order:', orderError);
      return new Response('Order creation failed', { status: 500 });
    }

    // Create order items
    const orderItems = (courses ?? []).map((course: any) => ({
      order_id: order.id,
      course_id: course.id,
      price_paid: course.sale_price || course.price,
    }));

    await supabase.from('order_items').insert(orderItems);

    // Create enrollments
    const enrollments = courseIds.map((courseId: string) => ({
      user_id: userId,
      course_id: courseId,
      stripe_payment_intent_id: session.payment_intent as string,
    }));

    await supabase.from('enrollments').insert(enrollments);

    // Increment student counts
    for (const courseId of courseIds) {
      await supabase.rpc('increment_students_count', { course_id: courseId }).catch(() => {
        // If RPC doesn't exist, manually update
        supabase
          .from('courses')
          .update({ students_count: supabase.rpc('', {}) })
          .eq('id', courseId);
      });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
