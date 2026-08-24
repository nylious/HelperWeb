-- Damanhour City GM Helper V5
-- Fixes logo uploads after upgrade_v4.sql.
-- Run once in Supabase SQL Editor.

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

drop policy if exists site_assets_admin_insert on storage.objects;
drop policy if exists site_assets_admin_update on storage.objects;
drop policy if exists site_assets_admin_delete on storage.objects;
drop policy if exists site_assets_public_select on storage.objects;

-- The application route verifies profiles.role = 'admin' before uploading.
-- Storage RLS only verifies that an authenticated user owns the object.
create policy site_assets_admin_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-assets'
  and owner_id = auth.uid()
);

create policy site_assets_admin_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'site-assets'
  and owner_id = auth.uid()
)
with check (
  bucket_id = 'site-assets'
  and owner_id = auth.uid()
);

create policy site_assets_admin_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'site-assets'
  and owner_id = auth.uid()
);

create policy site_assets_public_select
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'site-assets'
);
