# V12 Change Log

- Root layout is explicitly dynamic so changed site settings are reflected immediately.
- Header icon URLs use `updated_at` cache-busting.
- Site settings reads prefer the server-only Supabase service-role client.
- Admin settings writes verify the signed-in admin session, then use the server-only client.
- Logo/header-icon uploads use the server-only client for both Storage and database persistence.
- No command/item catalog data is changed.
