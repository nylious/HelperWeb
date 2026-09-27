-- Damanhour City GM Helper V14
-- Adds category-level visibility and enables it in the public catalog.
-- Run once in Supabase SQL Editor.

alter table public.categories
  add column if not exists is_visible boolean not null default true;

update public.categories
set is_visible = true
where is_visible is null;

alter table public.categories enable row level security;

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read
on public.categories
for select
to anon, authenticated
using (true);

drop policy if exists categories_admin_write on public.categories;
create policy categories_admin_write
on public.categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.categories;
exception when duplicate_object then null;
end $$;
