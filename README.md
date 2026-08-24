<div align="center">

# 🏙️ Damanhour City GM Helper

### Commands • Codes • Live GM Knowledge Base

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%2B%20Auth-1cce8a?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

A modern, gold-on-black web replacement for the Damanhour City desktop GM Helper.

**Live catalog • Admin CRUD • Supabase Auth • Realtime-ready • Vercel-friendly**

</div>

---

## ✨ What it does

| Area | What you get |
| --- | --- |
| 🎮 **Console Commands** | Normal commands, EU/CH groups, Uniques and Roc/Medusa entries |
| 💬 **Discord Commands** | Categories + searchable command/code browser |
| 🕹️ **In-game Commands** | Live catalog with the same category structure as the original Helper |
| 🧰 **Item Codes** | Item / weapon generator workflows and addable database categories |
| 🔐 **Admin** | Protected login, live CRUD, catalog sync and deployment-aware settings |
| 🗄️ **Database** | Supabase Postgres + RLS + Auth profile roles |

---

## 🎨 Design

The interface uses a deliberately restrained **Gold × Black** visual system:

- no bright blue/purple template look
- dense admin workspace inspired by professional dashboards
- compact cards and clear hierarchy
- monospace command/code presentation
- responsive layouts for desktop and smaller screens

---

## 🧱 Stack

```text
Next.js
├─ App Router
├─ React
├─ TypeScript
└─ Lucide Icons

Supabase
├─ Postgres
├─ Authentication
├─ Row Level Security
└─ Realtime-ready tables

Vercel
└─ Production hosting / automatic deploys
```

---

## 🚀 Deployment

### 1. GitHub

Push the full project to a GitHub repository.

### 2. Vercel

Import the repository as a **Next.js** project.

### 3. Environment Variables

Set these in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_OR_PUBLISHABLE_KEY
```

For the server-side admin catalog sync endpoint, also set:

```env
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

> ⚠️ **Never** prefix the service-role key with `NEXT_PUBLIC_` and never commit it to GitHub.

---

## 🗄️ Supabase setup

Open:

**Supabase → SQL Editor → New Query**

Run:

```text
supabase/setup.sql
```

That file is the single setup script for the current project. It contains:

- tables
- indexes/constraints
- profiles + admin role support
- authentication profile trigger
- RLS policies
- realtime table registration
- the verified seed catalog currently bundled with the project

### Create the first admin

Create the user in:

**Supabase → Authentication → Users**

Then run:

```sql
INSERT INTO public.profiles (id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'YOUR_EMAIL'
ON CONFLICT (id)
DO UPDATE SET role = 'admin';
```

After that, open:

```text
/admin/login
```

---

## 🔄 Catalog sync

The admin includes a **Sync catalog** action.

It is intentionally server-side and protected:

```text
Admin session
    ↓
role = admin
    ↓
server endpoint
    ↓
Supabase service-role client
    ↓
verified source catalog
    ↓
Postgres
```

This makes first-time database population recoverable without reopening the original desktop project.

---

## 📦 Project structure

```text
app/
├─ admin/
│  ├─ commands/
│  ├─ login/
│  ├─ settings/
│  └─ page.tsx
├─ api/admin/sync/
├─ section/[slug]/
├─ auth/signout/
├─ page.tsx
└─ globals.css

components/
├─ AdminCommandEditor.tsx
├─ CommandBrowser.tsx
└─ ItemGenerators.tsx

lib/
├─ data.ts
├─ static-data.ts
├─ types.ts
└─ supabase/

supabase/
├─ schema.sql
├─ seed.sql
└─ setup.sql
```

---

## 🧭 Source-of-truth strategy

The repository keeps a bundled catalog in `lib/static-data.ts` so the public helper can still render when the database is temporarily unavailable.

Once Supabase is populated, the live database becomes the source of truth for the web app and the Admin Panel.

This is intentional: **the site should never become a blank page just because the database is temporarily unavailable.**

---

## 🛡️ Security rules

- Public catalog data is readable through RLS.
- Write operations require an authenticated `admin` profile.
- The service-role key is server-only.
- Admin authentication is handled by Supabase Auth.
- `/admin/*` is protected by middleware + role verification.

---

## 🧪 Local development

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## 🧹 Notes

The original desktop Helper remains the reference source for command structure and generator behavior. The web project is designed to replace the **distribution/update pain** with a live database-backed catalog while preserving the command organization users already know.

---

<div align="center">

**DAMANHOUR CITY • GM UTILITY**

Made for fast GM workflows, clean command management and live updates.

</div>
