-- Multi-item invoices, reusable item catalog and reusable customers.

create table if not exists public.kupci (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  naziv text not null,
  oib text,
  adresa text,
  email text,
  created_at timestamptz not null default now()
);

alter table public.kupci
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists naziv text,
  add column if not exists oib text,
  add column if not exists adresa text,
  add column if not exists email text,
  add column if not exists created_at timestamptz not null default now();

create index if not exists kupci_user_naziv_idx on public.kupci (user_id, naziv);

alter table public.kupci enable row level security;

create table if not exists public.artikli (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  naziv text not null,
  jedinicna_cijena numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists artikli_user_naziv_idx on public.artikli (user_id, naziv);

alter table public.artikli enable row level security;

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  racun_id uuid not null references public.racuni(id) on delete cascade,
  opis text not null,
  kolicina numeric(12, 2) not null default 1,
  jedinicna_cijena numeric(12, 2) not null default 0,
  ukupno numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists invoice_items_racun_idx on public.invoice_items (racun_id);

alter table public.invoice_items enable row level security;

-- Copy legacy single/multi line items if the old table exists.
do $$
begin
  if to_regclass('public.stavke_racuna') is not null then
    execute $sql$
      insert into public.invoice_items (racun_id, opis, kolicina, jedinicna_cijena, ukupno)
      select sr.racun_id, sr.opis, sr.kolicina, sr.jedinicna_cijena, sr.ukupno
      from public.stavke_racuna sr
      where not exists (
        select 1
        from public.invoice_items ii
        where ii.racun_id = sr.racun_id
          and ii.opis = sr.opis
          and ii.kolicina = sr.kolicina
          and ii.jedinicna_cijena = sr.jedinicna_cijena
          and ii.ukupno = sr.ukupno
      )
    $sql$;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'kupci' and policyname = 'kupci_select_own'
  ) then
    create policy kupci_select_own on public.kupci
      for select using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'kupci' and policyname = 'kupci_insert_own'
  ) then
    create policy kupci_insert_own on public.kupci
      for insert with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'kupci' and policyname = 'kupci_update_own'
  ) then
    create policy kupci_update_own on public.kupci
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'kupci' and policyname = 'kupci_delete_own'
  ) then
    create policy kupci_delete_own on public.kupci
      for delete using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'artikli' and policyname = 'artikli_select_own'
  ) then
    create policy artikli_select_own on public.artikli
      for select using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'artikli' and policyname = 'artikli_insert_own'
  ) then
    create policy artikli_insert_own on public.artikli
      for insert with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'artikli' and policyname = 'artikli_update_own'
  ) then
    create policy artikli_update_own on public.artikli
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'artikli' and policyname = 'artikli_delete_own'
  ) then
    create policy artikli_delete_own on public.artikli
      for delete using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'invoice_items' and policyname = 'invoice_items_select_own'
  ) then
    create policy invoice_items_select_own on public.invoice_items
      for select using (
        exists (
          select 1 from public.racuni r
          where r.id = invoice_items.racun_id and r.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'invoice_items' and policyname = 'invoice_items_insert_own'
  ) then
    create policy invoice_items_insert_own on public.invoice_items
      for insert with check (
        exists (
          select 1 from public.racuni r
          where r.id = invoice_items.racun_id and r.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'invoice_items' and policyname = 'invoice_items_update_own'
  ) then
    create policy invoice_items_update_own on public.invoice_items
      for update using (
        exists (
          select 1 from public.racuni r
          where r.id = invoice_items.racun_id and r.user_id = auth.uid()
        )
      ) with check (
        exists (
          select 1 from public.racuni r
          where r.id = invoice_items.racun_id and r.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'invoice_items' and policyname = 'invoice_items_delete_own'
  ) then
    create policy invoice_items_delete_own on public.invoice_items
      for delete using (
        exists (
          select 1 from public.racuni r
          where r.id = invoice_items.racun_id and r.user_id = auth.uid()
        )
      );
  end if;
end $$;
