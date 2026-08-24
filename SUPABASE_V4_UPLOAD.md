# V4 logo upload setup

Run `supabase/upgrade_v4.sql` once in Supabase SQL Editor.

This configures the `site-assets` public bucket for:
- PNG
- JPG / JPEG
- WebP
- 5 MB maximum

The Admin Settings upload then works through the authenticated Supabase session and does not require the service-role key for normal logo uploads.
