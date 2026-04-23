-- IP-based registration rate limiting (Edge middleware + API route).
-- Access only via service role; anon/authenticated have no policies.

create table if not exists public.registration_attempts (
  id uuid primary key default gen_random_uuid(),
  ip text not null,
  created_at timestamptz not null default now()
);

create index if not exists registration_attempts_ip_created_at_idx
  on public.registration_attempts (ip, created_at desc);

comment on table public.registration_attempts is
  'Logs registration POST attempts by client IP for middleware rate limit (max 3/hour).';

alter table public.registration_attempts enable row level security;

revoke all on public.registration_attempts from anon, authenticated;
