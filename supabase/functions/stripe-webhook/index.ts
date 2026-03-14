import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13?target=deno';
import {
  applyRefundToOrder,
  createServiceClient,
  createStripeClient,
  finalizeCheckoutSession,
  getRefundableOrderByPaymentIntent,
  getErrorMessage,
  getRequiredEnv,
} from '../_shared/checkout-fulfillment.ts';

const stripe = createStripeClient();
const webhookSecret = getRequiredEnv('STRIPE_WEBHOOK_SECRET');

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
    const supabase = createServiceClient();

    try {
      await finalizeCheckoutSession(supabase, session);
    } catch (error) {
      console.error('Failed to finalize checkout session:', error);
      return new Response(getErrorMessage(error), { status: 500 });
    }
  }

  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId = typeof charge.payment_intent === 'string'
      ? charge.payment_intent
      : charge.payment_intent?.id ?? null;

    if (!paymentIntentId) {
      console.error('Refunded charge is missing payment_intent:', charge.id);
      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createServiceClient();

    try {
      const order = await getRefundableOrderByPaymentIntent(supabase, paymentIntentId);
      if (!order) {
        console.error('No order found for refunded payment intent:', paymentIntentId);
        return new Response(JSON.stringify({ received: true }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const latestRefund = charge.refunds.data.at(-1) ?? null;
      const refundedAt = latestRefund?.created
        ? new Date(latestRefund.created * 1000).toISOString()
        : new Date(event.created * 1000).toISOString();

      await applyRefundToOrder(
        supabase,
        order,
        latestRefund?.id ?? order.stripe_refund_id ?? null,
        refundedAt,
      );
    } catch (error) {
      console.error('Failed to reconcile refunded charge:', error);
      return new Response(getErrorMessage(error), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
