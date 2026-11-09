ALTER TABLE public.products ADD COLUMN original_price numeric;
ALTER TABLE public.products ADD CONSTRAINT products_original_price_valid CHECK (original_price IS NULL OR original_price > price) NOT VALID;
ALTER TABLE public.site_content ADD COLUMN checkout_settings jsonb NOT NULL DEFAULT '{"printingPrice":5,"patchesPrice":5,"shippingPrice":0}'::jsonb;
ALTER TABLE public.orders ADD COLUMN shipping_total numeric NOT NULL DEFAULT 0;
ALTER TABLE public.orders ADD CONSTRAINT orders_shipping_nonnegative CHECK (shipping_total >= 0) NOT VALID;