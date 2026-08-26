-- Damanhour City GM Helper V12
-- Run once in Supabase SQL Editor.

alter table public.site_settings
  add column if not exists updated_at timestamptz not null default now();

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

update public.site_settings
set updated_at = now()
where id = 1;

alter table public.site_settings enable row level security;

drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists site_settings_admin_write on public.site_settings;
create policy site_settings_admin_write
on public.site_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;

insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
values (
  'site-assets',
  'site-assets',
  true,
  5242880,
  array[
    'image/png',
    'image/svg+xml',
    'image/jpeg',
    'image/jpg',
    'image/webp'
  ]::text[]
)
on conflict (id) do update
set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = excluded.allowed_mime_types;
