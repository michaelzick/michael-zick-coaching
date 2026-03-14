ALTER TABLE public.orders
ADD COLUMN stripe_refund_id TEXT,
ADD COLUMN refunded_at TIMESTAMPTZ;
