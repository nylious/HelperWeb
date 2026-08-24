-- Damanhour City GM Helper V4: image upload hardening
-- Run once after upgrade_v3.sql.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-assets',
  'site-assets',
  true,
  5242880,
  array['image/png','image/jpeg','image/jpg','image/webp']::text[]
)
on conflict (id) do update
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = excluded.allowed_mime_types;

-- Recreate admin policies with the current admin check.
drop policy if exists site_assets_admin_insert on storage.objects;
create policy site_assets_admin_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-assets'
  and public.is_admin()
);

drop policy if exists site_assets_admin_update on storage.objects;
create policy site_assets_admin_update
on storage.objects
for update
using (
  bucket_id = 'site-assets'
  and public.is_admin()
)
with check (
  bucket_id = 'site-assets'
  and public.is_admin()
);

drop policy if exists site_assets_admin_delete on storage.objects;
create policy site_assets_admin_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'site-assets'
  and public.is_admin()
);
