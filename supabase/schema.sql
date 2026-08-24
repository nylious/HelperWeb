create extension if not exists pgcrypto;

create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  kind text not null default 'commands',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  name text not null,
  slug text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(section_id, slug)
);

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  code text not null default '',
  description text not null default '',
  uses_amount boolean not null default false,
  variants jsonb not null default '{}'::jsonb,
  levels jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sections_updated_at on public.sections;
create trigger sections_updated_at before update on public.sections for each row execute procedure public.set_updated_at();
drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at before update on public.categories for each row execute procedure public.set_updated_at();
drop trigger if exists entries_updated_at on public.entries;
create trigger entries_updated_at before update on public.entries for each row execute procedure public.set_updated_at();



-- Create a profile row automatically whenever a new Auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user')
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

alter table public.sections enable row level security;
alter table public.categories enable row level security;
alter table public.entries enable row level security;
alter table public.profiles enable row level security;

drop policy if exists sections_public_read on public.sections;
create policy sections_public_read on public.sections for select to anon, authenticated using (true);
drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories for select to anon, authenticated using (true);
drop policy if exists entries_public_read on public.entries;
create policy entries_public_read on public.entries for select to anon, authenticated using (true);

drop policy if exists sections_admin_write on public.sections;
create policy sections_admin_write on public.sections for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists categories_admin_write on public.categories;
create policy categories_admin_write on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists entries_admin_write on public.entries;
create policy entries_admin_write on public.entries for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles for select to authenticated using (id = auth.uid());

grant select on public.sections, public.categories, public.entries to anon, authenticated;
grant insert, update, delete on public.sections, public.categories, public.entries to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.sections;
  alter publication supabase_realtime add table public.categories;
  alter publication supabase_realtime add table public.entries;
exception when duplicate_object then null;
end $$;

revoke all on function public.handle_new_user() from public;
