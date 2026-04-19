-- Freemium / PRO alati: plan i opcionalna općina za uplatnice.
alter table public.profiles
  add column if not exists kvit_plan text not null default 'free';

comment on column public.profiles.kvit_plan is 'free | pro — pretplatnički alati i podsjetnici';

alter table public.profiles
  add column if not exists opcina text;

comment on column public.profiles.opcina is 'Općina obrta (opcionalno), za uplatnice i izvještaje';
