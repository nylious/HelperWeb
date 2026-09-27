-- Damanhour City GM Helper V15
-- Adds section-level and category-level visibility controls.
-- Run once in Supabase SQL Editor.

alter table public.sections
  add column if not exists is_visible boolean not null default true;

alter table public.categories
  add column if not exists is_visible boolean not null default true;

update public.sections set is_visible = true where is_visible is null;
update public.categories set is_visible = true where is_visible is null;

alter table public.sections enable row level security;
alter table public.categories enable row level security;

-- Public users can read the catalog; the application filters hidden content.
drop policy if exists sections_public_read on public.sections;
create policy sections_public_read on public.sections for select to anon, authenticated using (true);

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories for select to anon, authenticated using (true);

-- Only admins can change visibility.
drop policy if exists sections_admin_write on public.sections;
create policy sections_admin_write on public.sections
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists categories_admin_write on public.categories;
create policy categories_admin_write on public.categories
for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.sections, public.categories to anon, authenticated;
grant insert, update, delete on public.sections, public.categories to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.sections;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.categories;
exception when duplicate_object then null;
end $$;
