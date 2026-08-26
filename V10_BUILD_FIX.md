# V10 Build Fix

Fixed the TypeScript/Supabase `upsert` inference error in:
`app/api/admin/site-settings/logo/route.ts`.

The upload patch is now explicitly typed so both logo and header-icon updates
are valid with Supabase's typed `upsert` call.
