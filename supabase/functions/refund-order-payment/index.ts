import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {
  HttpError,
  applyRefundToOrder,
  assertOrderRefundable,
  createServiceClient,
  createStripeClient,
  getErrorMessage,
  getRefundableOrderById,
  requireAdminUser,
} from '../_shared/checkout-fulfillment.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const stripe = createStripeClient();

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  try {
    const { orderId } = await req.json();
    if (!orderId || typeof orderId !== 'string') {
      return jsonResponse({ error: 'orderId is required.' }, 400);
    }

    const supabase = createServiceClient();
    await requireAdminUser(supabase, req.headers.get('Authorization'));

    const order = await getRefundableOrderById(supabase, orderId);
    assertOrderRefundable(order);

    const refund = await stripe.refunds.create({
      payment_intent: order.stripe_payment_intent_id!,
      reason: 'requested_by_customer',
      metadata: {
        orderId: order.id,
        userId: order.user_id,
      },
    });

    if (refund.status === 'failed' || refund.status === 'canceled') {
      return jsonResponse(
        { error: `Stripe reported the refund as ${refund.status}.` },
        409,
      );
    }

    const refundedAt = new Date().toISOString();

    try {
      const revokedEnrollmentCount = await applyRefundToOrder(
        supabase,
        order,
        refund.id,
        refundedAt,
      );

      return jsonResponse({
        refundId: refund.id,
        refundStatus: refund.status,
        orderStatus: 'refunded',
        revokedEnrollmentCount,
      });
    } catch (error) {
      console.error('Refund created in Stripe, but local reconciliation failed:', error);
      return jsonResponse(
        {
          error: 'Refund created in Stripe, but local records could not be updated yet.',
        },
        500,
      );
    }
  } catch (error) {
    if (error instanceof HttpError) {
      return jsonResponse({ error: error.message }, error.status);
    }

    console.error('Failed to refund order payment:', error);
    return jsonResponse({ error: getErrorMessage(error) }, 500);
  }
});
