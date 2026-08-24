# Deploy V3

1. Replace the GitHub repository contents with this project.
2. Commit to `main`; Vercel deploys automatically.
3. In Supabase SQL Editor, run `supabase/upgrade_v3.sql` once.
4. Keep `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured.
5. `SUPABASE_SERVICE_ROLE_KEY` is needed only for Admin -> Settings -> Sync Catalog.
6. Logo upload does not require the service-role key after the SQL upgrade.
