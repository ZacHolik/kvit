-- Sloj 2: posjeti alata s ?ref= (value gate)

create table public.referral_visits (
  id uuid primary key default gen_random_uuid(),
  referrer_user_id uuid not null references auth.users (id) on delete cascade,
  referral_code text not null,
  visitor_ip_hash text not null,
  visited_at timestamptz not null default now(),
  converted boolean not null default false
);

create unique index referral_visits_code_ip_hash_uq on public.referral_visits (referral_code, visitor_ip_hash);

create index referral_visits_referrer_idx on public.referral_visits (referrer_user_id);

comment on table public.referral_visits is 'Sloj 2: posjeti alata s referral linkom (deduplikacija po kodu + hash IP-a).';

alter table public.referral_visits enable row level security;
