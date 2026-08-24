-- Damanhour City GM Helper v3 upgrade
-- Run once after the existing setup/upgrade scripts.

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = excluded.public;

-- Admins can upload/update/delete files in the site-assets bucket.
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
to authenticated
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

-- Public reads are served by the public bucket.
