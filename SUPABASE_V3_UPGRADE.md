# Supabase V3 Upgrade

Run `supabase/upgrade_v3.sql` once.

This adds Storage policies that allow an authenticated admin to upload/update/delete files in the public `site-assets` bucket.

After that, homepage logo upload works without the service-role key. The service-role key is still required for `/api/admin/sync`.
