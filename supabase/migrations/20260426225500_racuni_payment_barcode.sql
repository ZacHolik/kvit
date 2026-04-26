-- Optional HUB3A/PDF417 payment barcode flag for invoice PDFs.

alter table public.racuni
  add column if not exists dodaj_barkod_placanja boolean not null default true;

comment on column public.racuni.dodaj_barkod_placanja is
  'Whether the invoice PDF should include HUB3A/PDF417 payment barcode when payment method is ziro.';
