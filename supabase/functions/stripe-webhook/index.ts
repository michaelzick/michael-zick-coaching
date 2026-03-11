import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13?target=deno';
import {
  createServiceClient,
  createStripeClient,
  finalizeCheckoutSession,
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

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
