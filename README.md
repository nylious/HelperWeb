# 🏙️ Damanhour City GM Helper

<div align="center">

**A modern Gold × Black command center for Damanhour City GMs.**

Fast lookup • Live catalog • Console generators • Admin control • Supabase • Vercel

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%2B%20Auth-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000?logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## ✨ What it does

Damanhour City GM Helper turns the old desktop helper workflow into a live web workspace.

- ⚡ **Discord Commands** — categorized command lookup with copy-ready output.
- 🎮 **In-game Commands** — organized command catalog.
- 🧩 **Console Commands** — GM commands, EU/CH variants and unique spawners.
- ⚔️ **Item / Weapon Generators** — built around the original Helper logic.
- 🔐 **Admin Console** — edit live entries without rebuilding the public site.
- 🖼️ **Homepage Controls** — change the logo and homepage copy from Admin → Settings.
- 👤 **Admin Profile** — display name + password controls in a slide-over account panel.
- ⏱️ **Security** — 15-minute inactivity timeout + optional Remember Me.
- 🗄️ **Supabase** — database, authentication, role checks and live settings.
- 🚀 **Vercel** — Git-driven deployment.

---

## 🗂️ Sections

```text
Damanhour City GM Helper
│
├── Discord Commands
│   ├── Streaming / Nitro Commands
│   ├── Silk - Gold - Package Commands
│   ├── CHAR Commands
│   ├── Quests Commands
│   ├── Card Collection Commands
│   └── Ban Commands
│
├── In-game Commands
│   ├── Titles / Streaming Commands
│   ├── Silk / Gift Commands
│   ├── Character Commands
│   ├── Inventory Commands
│   └── Plus / FB Commands
│
├── Item Codes
│   └── Item + Weapon Generators
│
└── Console Commands
    ├── Normal Commands
    ├── Normal EU
    ├── Normal CH
    ├── Zealot Uniques
    ├── Temple Uniques
    └── Roc - Medusa
```

---

## 🛠️ Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js + React + TypeScript |
| Styling | Custom Gold × Black UI |
| Icons | Lucide React |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| Hosting | Vercel |
| Source | GitHub |

---

## 🔐 Admin security

Admin access is **role-based**.

```text
Supabase Auth user
        ↓
public.profiles
        ↓
role = admin
        ↓
/admin
```

The Admin workspace also includes:

- **Remember Me** for browser persistence.
- **15-minute inactivity timeout**.
- Profile drawer with display name.
- Password change from the account drawer.
- Server-side protection through middleware.

> Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

---

## ⚙️ Environment variables

Create these in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only and is required only by the protected catalog sync route. Profile edits and homepage logo uploads use the authenticated admin session.

---

## 🗄️ Supabase setup

### Existing project

If you already ran the original `setup.sql`, run:

```text
supabase/upgrade_v2.sql
```

This adds:

- `profiles.display_name`
- `site_settings`
- public site asset storage bucket
- realtime support for site settings

### Fresh project

For a new Supabase project, run:

```text
supabase/setup.sql
```

That file includes schema + policies + catalog seed.

---

## 🖼️ Homepage settings

From:

```text
Admin
  → Settings
  → Home Identity
```

You can change:

- Logo
- Overline
- Hero title lines
- Hero description
- Live card title
- Live card description
- Primary button text
- Secondary button text

The logo can be uploaded directly to Supabase Storage.

---

## 🧑‍💻 Local development

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

---

## 🚀 Deploy to Vercel

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Set the three environment variables above.
4. Deploy.
5. Run the required Supabase SQL migration.
6. Create your Admin user in Supabase Auth.
7. Promote the user to `admin` in `public.profiles`.

Example:

```sql
INSERT INTO public.profiles (id, role, display_name)
SELECT id, 'admin', 'Damanhour Admin'
FROM auth.users
WHERE email = 'YOUR_EMAIL'
ON CONFLICT (id)
DO UPDATE SET
  role = 'admin',
  display_name = excluded.display_name;
```

---

## 🧭 Project map

```text
app/
├── admin/
│   ├── commands/
│   ├── login/
│   ├── settings/
│   └── page.tsx
├── api/
│   └── admin/
├── section/
└── page.tsx

components/
├── AdminAccountMenu.tsx
├── AdminCommandEditor.tsx
├── AdminSessionGuard.tsx
├── CommandBrowser.tsx
└── ItemGenerators.tsx

lib/
├── data.ts
├── site-settings.ts
├── static-data.ts
└── supabase/

supabase/
├── setup.sql
├── schema.sql
└── upgrade_v2.sql
```

---

## 📝 Design direction

The UI intentionally avoids the typical blue/purple SaaS-template look.

**Direction:**

> **Gold × Black • premium • minimal • GM utility • dense but readable**

The public helper and Admin console share the same visual language while keeping different information densities.

---

## 📜 Notes

This repository is the web successor to the Damanhour City desktop GM Helper. The command catalog remains grounded in the existing Helper source and verified catalog data; the database becomes the live source of truth once synced.

---

<div align="center">

**Damanhour City • GM Utility**  
Built for fast GM workflows.

</div>


## V3 Notes
- Homepage logo uploads use the authenticated admin session and Supabase Storage policies; logo editing no longer depends on the service-role key.
- `SUPABASE_SERVICE_ROLE_KEY` is only required for the catalog sync route.
- Admin command sections now have shortcut cards above the editor search.
- Settings has explicit back/open-helper controls.
