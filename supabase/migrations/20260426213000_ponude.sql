-- Offers (ponude) and offer line items.

create table if not exists public.ponude (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  broj_ponude text not null,
  datum date not null,
  datum_valjanosti date,
  kupac_naziv text not null,
  kupac_oib text,
  kupac_adresa text,
  kupac_email text,
  status text not null default 'poslana',
  napomena text,
  ukupno numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists ponude_user_datum_idx on public.ponude (user_id, datum desc);

alter table public.ponude enable row level security;

create table if not exists public.ponuda_items (
  id uuid primary key default gen_random_uuid(),
  ponuda_id uuid not null references public.ponude(id) on delete cascade,
  opis text not null,
  kolicina numeric(12, 2) not null default 1,
  jedinicna_cijena numeric(12, 2) not null default 0,
  ukupno numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists ponuda_items_ponuda_idx on public.ponuda_items (ponuda_id);

alter table public.ponuda_items enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'ponude' and policyname = 'ponude_select_own'
  ) then
    create policy ponude_select_own on public.ponude
      for select using (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'ponude' and policyname = 'ponude_insert_own'
  ) then
    create policy ponude_insert_own on public.ponude
      for insert with check (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'ponude' and policyname = 'ponude_update_own'
  ) then
    create policy ponude_update_own on public.ponude
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'ponude' and policyname = 'ponude_delete_own'
  ) then
    create policy ponude_delete_own on public.ponude
      for delete using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'ponuda_items' and policyname = 'ponuda_items_select_own'
  ) then
    create policy ponuda_items_select_own on public.ponuda_items
      for select using (
        exists (
          select 1 from public.ponude p
          where p.id = ponuda_items.ponuda_id and p.user_id = auth.uid()
        )
      );
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'ponuda_items' and policyname = 'ponuda_items_insert_own'
  ) then
    create policy ponuda_items_insert_own on public.ponuda_items
      for insert with check (
        exists (
          select 1 from public.ponude p
          where p.id = ponuda_items.ponuda_id and p.user_id = auth.uid()
        )
      );
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'ponuda_items' and policyname = 'ponuda_items_update_own'
  ) then
    create policy ponuda_items_update_own on public.ponuda_items
      for update using (
        exists (
          select 1 from public.ponude p
          where p.id = ponuda_items.ponuda_id and p.user_id = auth.uid()
        )
      ) with check (
        exists (
          select 1 from public.ponude p
          where p.id = ponuda_items.ponuda_id and p.user_id = auth.uid()
        )
      );
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'ponuda_items' and policyname = 'ponuda_items_delete_own'
  ) then
    create policy ponuda_items_delete_own on public.ponuda_items
      for delete using (
        exists (
          select 1 from public.ponude p
          where p.id = ponuda_items.ponuda_id and p.user_id = auth.uid()
        )
      );
  end if;
end $$;
