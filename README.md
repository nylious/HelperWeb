# Damanhour City GM Helper — Web

Next.js + Supabase + Vercel.

## Deploy

1. Push this folder to GitHub.
2. Import the repository into Vercel.
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. In Supabase -> SQL Editor, run **`supabase/setup.sql`**.
   This creates the schema, RLS policies, auth profile trigger, AND seeds
   the complete catalog currently embedded in `lib/static-data.ts`.
5. In Supabase -> Authentication -> Users, create the admin account.
6. In SQL Editor, make that user an admin:

```sql
INSERT INTO public.profiles (id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'YOUR_EMAIL'
ON CONFLICT (id)
DO UPDATE SET role = 'admin';
```

## Important

- `setup.sql` is the single migration+seed file for this project.
- The public helper falls back to the catalog in `lib/static-data.ts` if the
  database is temporarily empty, so the site doesn't become blank.
- Once `setup.sql` has been run, the database is the live source.
- Do not expose a Supabase service-role secret in `NEXT_PUBLIC_*` variables.
- Theme: Gold / Black.
