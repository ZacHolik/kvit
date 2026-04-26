-- Invoice metadata for R1/R2 labels, payment barcode toggle, and recurring markers.

alter table public.racuni
  add column if not exists tip_racuna text not null default 'R1',
  add column if not exists barkod_enabled boolean not null default true,
  add column if not exists recurring boolean not null default false,
  add column if not exists recurring_interval text;

update public.racuni
set barkod_enabled = dodaj_barkod_placanja
where to_regclass('public.racuni') is not null
  and exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'racuni'
      and column_name = 'dodaj_barkod_placanja'
  );

alter table public.racuni
  drop constraint if exists racuni_tip_racuna_check,
  add constraint racuni_tip_racuna_check
    check (tip_racuna in ('R1', 'R2', 'bez_oznake'));

alter table public.racuni
  drop constraint if exists racuni_recurring_interval_check,
  add constraint racuni_recurring_interval_check
    check (
      (recurring = false and recurring_interval is null)
      or (recurring = true and recurring_interval in ('mjesecno', 'kvartalno', 'godisnje'))
    );

comment on column public.racuni.tip_racuna is
  'Invoice label: R1 for B2B, R2 for B2C, or bez_oznake when no label is needed.';

comment on column public.racuni.barkod_enabled is
  'Whether invoice PDFs should include a payment barcode when payment method supports it.';

comment on column public.racuni.recurring is
  'Marks invoice as recurring; automatic generation is handled separately.';
