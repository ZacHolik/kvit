ALTER TABLE public.fiscal_certificates
ADD COLUMN IF NOT EXISTS encrypted_password TEXT;
