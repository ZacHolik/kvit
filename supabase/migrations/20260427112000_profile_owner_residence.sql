-- Owner residence address for PO-SD, separate from business seat address.

alter table public.profiles
  add column if not exists vlasnik_ime text,
  add column if not exists vlasnik_ulica text,
  add column if not exists vlasnik_postanski_broj text,
  add column if not exists vlasnik_grad text,
  add column if not exists vlasnik_sifra_opcine text,
  add column if not exists vlasnik_ispostava_pu text,
  add column if not exists adresa_ista boolean not null default true;

comment on column public.profiles.vlasnik_ime is 'Ime i prezime vlasnika obrta';
comment on column public.profiles.vlasnik_ulica is 'Ulica i kućni broj prebivališta vlasnika';
comment on column public.profiles.vlasnik_postanski_broj is 'Poštanski broj prebivališta vlasnika';
comment on column public.profiles.vlasnik_grad is 'Grad ili mjesto prebivališta vlasnika';
comment on column public.profiles.vlasnik_sifra_opcine is 'Šifra općine/grada prebivališta vlasnika za PO-SD';
comment on column public.profiles.vlasnik_ispostava_pu is 'Ispostava Porezne uprave prema prebivalištu vlasnika';
comment on column public.profiles.adresa_ista is 'True ako je prebivalište vlasnika isto kao sjedište obrta';
