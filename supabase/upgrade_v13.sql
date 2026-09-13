-- Damanhour City GM Helper V13
-- Adds visibility controls without deleting or changing catalog content.
-- Run once in Supabase SQL Editor.

alter table public.sections
  add column if not exists is_visible boolean not null default true;

alter table public.entries
  add column if not exists is_visible boolean not null default true;

update public.sections set is_visible = true where is_visible is null;
update public.entries set is_visible = true where is_visible is null;

alter table public.sections enable row level security;
alter table public.entries enable row level security;

drop policy if exists sections_public_read on public.sections;
create policy sections_public_read
on public.sections
for select
to anon, authenticated
using (true);

drop policy if exists entries_public_read on public.entries;
create policy entries_public_read
on public.entries
for select
to anon, authenticated
using (true);

drop policy if exists sections_admin_write on public.sections;
create policy sections_admin_write
on public.sections
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists entries_admin_write on public.entries;
create policy entries_admin_write
on public.entries
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select on public.sections, public.entries to anon, authenticated;
grant insert, update, delete on public.sections, public.entries to authenticated;

-- Keep realtime enabled for visibility changes.
do $$
begin
  alter publication supabase_realtime add table public.sections;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.entries;
exception when duplicate_object then null;
end $$;
