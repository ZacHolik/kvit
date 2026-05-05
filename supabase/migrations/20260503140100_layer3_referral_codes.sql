-- Sloj 3: early adopter lock, /r/[code], aktivacije prijatelja

alter table public.referrals
  add column if not exists referrer_user_id uuid references auth.users (id) on delete cascade;

alter table public.referrals
  alter column referrer_share_id drop not null;

alter table public.referrals
  add constraint referrals_one_source check (
    (referrer_share_id is not null and referrer_user_id is null)
    or (referrer_share_id is null and referrer_user_id is not null)
  );

alter table public.referrals
  drop constraint if exists referrals_referrer_share_id_referred_user_id_key;

create unique index if not exists referrals_referred_user_unique on public.referrals (referred_user_id);

create unique index if not exists referrals_share_pair_unique on public.referrals (referrer_share_id, referred_user_id)
  where referrer_share_id is not null;

create table public.user_referral_codes (
  user_id uuid primary key references auth.users (id) on delete cascade,
  code text not null unique,
  created_at timestamptz not null default now(),
  constraint user_referral_codes_code_len check (char_length(code) = 6),
  constraint user_referral_codes_code_charset check (code ~ '^[a-z0-9]{6}$')
);

create index user_referral_codes_code_idx on public.user_referral_codes (code);

create type public.referral_activation_type as enum (
  'ai_question',
  'calculator',
  'posd_preview'
);

create table public.referral_activations (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references auth.users (id) on delete cascade,
  referred_id uuid not null references auth.users (id) on delete cascade,
  activation_type public.referral_activation_type not null,
  activated_at timestamptz not null default now(),
  unique (referrer_id, referred_id, activation_type)
);

create index referral_activations_referrer_idx on public.referral_activations (referrer_id);
create index referral_activations_referred_idx on public.referral_activations (referred_id);

alter table public.profiles
  add column if not exists price_locked boolean not null default false,
  add column if not exists locked_price numeric(10, 2),
  add column if not exists pro_expires_at timestamptz;

comment on column public.profiles.price_locked is 'Sloj 3: true kad 3 prijatelja aktiviraju Kvik (referral_activations).';
comment on column public.profiles.locked_price is 'Sloj 3: zaključana cijena (npr. 5.60).';
comment on column public.profiles.pro_expires_at is 'Sloj 2: PRO pristup do datuma (trial / nagrada).';

alter table public.user_referral_codes enable row level security;
alter table public.referral_activations enable row level security;
