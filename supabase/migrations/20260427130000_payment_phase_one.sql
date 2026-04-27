-- Phase 1 payment features: discounts, payment terms and delivery costs.

alter table public.racuni
  add column if not exists popust_racun numeric(5, 2) not null default 0,
  add column if not exists rok_placanja text,
  add column if not exists datum_dospijeca date,
  add column if not exists dostava_iznos numeric(12, 2) not null default 0,
  add column if not exists dostava_opis text;

alter table public.invoice_items
  add column if not exists popust numeric(5, 2) not null default 0;

alter table public.ponude
  add column if not exists popust_racun numeric(5, 2) not null default 0,
  add column if not exists rok_placanja text,
  add column if not exists datum_dospijeca date,
  add column if not exists dostava_iznos numeric(12, 2) not null default 0,
  add column if not exists dostava_opis text;

alter table public.ponuda_items
  add column if not exists popust numeric(5, 2) not null default 0;

comment on column public.racuni.popust_racun is 'Overall invoice discount percentage applied after line item totals';
comment on column public.racuni.rok_placanja is 'Payment deadline label, e.g. 15 dana';
comment on column public.racuni.datum_dospijeca is 'Calculated invoice due date';
comment on column public.racuni.dostava_iznos is 'Delivery or transport cost added after discount';
comment on column public.racuni.dostava_opis is 'Delivery or transport cost description';
comment on column public.invoice_items.popust is 'Line item discount percentage';

comment on column public.ponude.popust_racun is 'Overall offer discount percentage applied after line item totals';
comment on column public.ponude.rok_placanja is 'Payment deadline label, e.g. 15 dana';
comment on column public.ponude.datum_dospijeca is 'Calculated payment due date if offer becomes invoice';
comment on column public.ponude.dostava_iznos is 'Delivery or transport cost added after discount';
comment on column public.ponude.dostava_opis is 'Delivery or transport cost description';
comment on column public.ponuda_items.popust is 'Offer line item discount percentage';
