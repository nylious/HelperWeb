# Damanhour City GM Helper — Web Edition

A Vercel-ready Next.js + Supabase rebuild of the Damanhour City GM Helper.

## What is already migrated

The project was built from the actual source material available in the conversation:
- `DamanhourCityCommands_Source.zip`
- `Data.zip`
- the later `MainForm_console_all_uniques.cs` source used for the complete Console/Unique command catalog.

The seed currently contains **141 command entries**:
- 53 Discord Commands
- 27 In-game Commands
- 61 Console Commands / Unique spawners

The original Helper's Item Code system is implemented as the same generators used by the source code rather than pretending the placeholder item JSONs are a real item catalog.

## Stack

- Next.js App Router + TypeScript
- Vercel
- Supabase Postgres
- Supabase Auth
- Supabase Realtime

Supabase's current Next.js guidance uses `@supabase/ssr` and cookie-based sessions. The public catalog uses Supabase Realtime to pick up live entry changes. See the official docs for current setup details.

## 1. Supabase

Create a Supabase project.

Run these files in the Supabase SQL Editor, in this order:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

Then create your admin account in Supabase Authentication.

After the user exists, make the account an admin with:

```sql
insert into public.profiles (id, role)
values ('YOUR_AUTH_USER_UUID', 'admin')
on conflict (id) do update set role = 'admin';
```

## 2. Local environment

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
```

## 3. Install and run

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Admin:

```text
http://localhost:3000/admin/login
```

## 4. Vercel

Import the repository into Vercel and set the same two environment variables in Project Settings.

No database file needs to be deployed with the site. Supabase is the live source of truth.

## Data model

```text
sections
  └─ categories
       └─ entries
```

Each entry supports:

- name
- code
- description
- amount flag
- variants JSON
- levels JSON
- sort order

## Important behavior

The public website is read-only.

Only authenticated Supabase users whose `profiles.role = 'admin'` can create, update, or delete catalog entries. Row Level Security is enabled.

The public command browser subscribes to database changes so edits from the Admin panel are reflected without rebuilding or republishing the website.

## Item generators

The original WinForms Helper generated item codes like:

```text
!makeset eu 11 a clothes male 0
```

and weapon codes like:

```text
!OneHand 0
!OneHandegy 3
!OneHandrare 7
```

The web Item Codes page keeps that behavior instead of depending on the placeholder item JSON files.
