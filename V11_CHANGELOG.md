# V11 Change Log

Fixed the shared homepage/settings persistence path.

- Added one idempotent migration: `supabase/upgrade_v11.sql`
- Guarantees every `site_settings` column used by the current app exists,
  including `header_icon_url`, `primary_button_href`, and
  `secondary_button_href`.
- Refreshes the singleton row and admin write policy.
- Homepage settings now update the existing `id = 1` row instead of using
  `upsert`.
- Logo/header-icon uploads update only their specific URL column and expose
  the exact database error if Supabase rejects the write.
- No command, item, or catalog data is changed.
