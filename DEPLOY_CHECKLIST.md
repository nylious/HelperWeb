# 🚀 Production Deploy Checklist

## GitHub

- Upload the entire project contents to the repository.
- Commit directly to `main`.

## Vercel Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The first two are public client variables. The service-role key is server-only.

## Supabase

1. SQL Editor → New Query.
2. Run `supabase/setup.sql` once.
3. Authentication → Users → create the admin account.
4. Set the role:

```sql
INSERT INTO public.profiles (id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'YOUR_EMAIL'
ON CONFLICT (id)
DO UPDATE SET role = 'admin';
```

## First Admin Login

Open:

```text
/admin/login
```

Then:

```text
/admin/settings
```

Click **Sync catalog** once.

The dashboard should show the live catalog and section cards.
