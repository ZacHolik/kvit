-- Add UTM / signup source tracking columns to profiles
alter table public.profiles
  add column if not exists signup_source text;

alter table public.profiles
  add column if not exists utm_source text;
