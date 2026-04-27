-- Additional profile settings used by invoices and PO-SD.

alter table public.profiles
  add column if not exists ulica text,
  add column if not exists postanski_broj text,
  add column if not exists grad text,
  add column if not exists sifra_opcine text,
  add column if not exists ispostava_porezne text;

comment on column public.profiles.ulica is 'Ulica i kućni broj sjedišta obrta';
comment on column public.profiles.postanski_broj is 'Poštanski broj sjedišta obrta';
comment on column public.profiles.grad is 'Grad ili mjesto sjedišta obrta';
comment on column public.profiles.sifra_opcine is 'Troznamekasta šifra općine/grada za PO-SD';
comment on column public.profiles.ispostava_porezne is 'Nadležna ispostava Porezne uprave';
