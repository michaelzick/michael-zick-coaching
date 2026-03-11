WITH ranked_orders AS (
  SELECT
    id,
    stripe_checkout_session_id,
    ROW_NUMBER() OVER (
      PARTITION BY stripe_checkout_session_id
      ORDER BY created_at ASC, id ASC
    ) AS row_num
  FROM public.orders
  WHERE stripe_checkout_session_id IS NOT NULL
),
duplicate_orders AS (
  SELECT id
  FROM ranked_orders
  WHERE row_num > 1
)
DELETE FROM public.order_items
WHERE order_id IN (SELECT id FROM duplicate_orders);

WITH ranked_orders AS (
  SELECT
    id,
    stripe_checkout_session_id,
    ROW_NUMBER() OVER (
      PARTITION BY stripe_checkout_session_id
      ORDER BY created_at ASC, id ASC
    ) AS row_num
  FROM public.orders
  WHERE stripe_checkout_session_id IS NOT NULL
)
DELETE FROM public.orders
WHERE id IN (
  SELECT id
  FROM ranked_orders
  WHERE row_num > 1
);

DO $$
BEGIN
  ALTER TABLE public.orders
    ADD CONSTRAINT orders_stripe_checkout_session_id_key UNIQUE (stripe_checkout_session_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.order_items
    ADD CONSTRAINT order_items_order_id_course_id_key UNIQUE (order_id, course_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
