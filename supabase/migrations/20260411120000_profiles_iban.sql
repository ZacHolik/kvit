-- Optional IBAN za račun PDF i prikaz (onboarding korak 2).
alter table public.profiles
  add column if not exists iban text;

comment on column public.profiles.iban is 'IBAN obrta (opcionalno), npr. HR...';
