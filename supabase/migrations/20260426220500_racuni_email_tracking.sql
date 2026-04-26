-- Track when an invoice PDF was sent by email.

alter table public.racuni
  add column if not exists email_poslano_at timestamptz,
  add column if not exists email_poslano_na text;

comment on column public.racuni.email_poslano_at is
  'Timestamp when the invoice was last successfully sent by email.';

comment on column public.racuni.email_poslano_na is
  'Recipient email address used for the last successful invoice email send.';
