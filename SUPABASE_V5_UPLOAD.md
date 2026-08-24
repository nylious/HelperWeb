# V5 Logo Upload Fix

Run `supabase/upgrade_v5.sql` once in Supabase SQL Editor.

V5 replaces the Storage RLS policy that depended on `public.is_admin()` with an
ownership check using `storage.objects.owner_id = auth.uid()`. The API route
already verifies that the signed-in user has `profiles.role = 'admin'`.

After running the SQL:
1. Redeploy the latest GitHub commit on Vercel.
2. Open Admin -> Settings.
3. Upload PNG/JPG/JPEG/WebP (max 5 MB).
4. Save homepage settings.

The upload route now exposes the exact Supabase Storage error if anything still
blocks the upload.
