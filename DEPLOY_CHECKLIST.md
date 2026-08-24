# Deployment checklist

## GitHub
- [ ] Replace repository contents with this project.
- [ ] Commit changes to `main`.

## Vercel environment
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

## Supabase
### Existing project
- [ ] Run `supabase/upgrade_v2.sql`

### New project
- [ ] Run `supabase/setup.sql`

## Admin user
- [ ] Create the user in Supabase Authentication.
- [ ] Insert/update `public.profiles.role = 'admin'`.
- [ ] Optional: set `display_name`.

## First run
- [ ] Open `/admin/login`.
- [ ] Sign in.
- [ ] Open Settings.
- [ ] Sync catalog.
- [ ] Set the homepage logo and copy.
- [ ] Test the profile drawer.
- [ ] Test inactivity timeout.

## Weapon generator
- [ ] Normal + Nova: verify EU and CH output.
- [ ] Degree 11: verify Normal / Seal of Nova options.
- [ ] Plus 1–12 and 255.
- [ ] Egy: verify `!OneHandegy 0` style output.
