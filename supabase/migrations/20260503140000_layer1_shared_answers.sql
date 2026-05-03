-- Sloj 1: AI dijeljenje odgovora (shared_answers + referrals s referrer_share_id)

create table public.shared_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now(),
  visit_count integer not null default 0,
  signup_count integer not null default 0
);

create index shared_answers_user_id_idx on public.shared_answers (user_id);
create index shared_answers_created_at_idx on public.shared_answers (created_at desc);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_share_id uuid not null references public.shared_answers (id) on delete cascade,
  referred_user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (referrer_share_id, referred_user_id)
);

create index referrals_referred_user_id_idx on public.referrals (referred_user_id);

alter table public.shared_answers enable row level security;
alter table public.referrals enable row level security;

comment on table public.shared_answers is 'Javno dijeljeni AI odgovori s /asistent (Sloj 1).';
comment on table public.referrals is 'Registracija s /share/[uuid] CTA (referrer_share_id → shared_answers).';
