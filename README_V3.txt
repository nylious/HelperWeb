V3: Login + Modern Admin UI

Fixes:
- Supabase browser client accepts either:
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- Login catches configuration, auth and network errors.
- Login has a 12-second timeout instead of hanging forever.
- Middleware uses the same key fallback logic.
- Added a modern dark admin dashboard and modern admin sign-in UI.
- Existing public/helper routes and data logic remain in place.

GitHub replacement:
1. lib/supabase/client.ts
2. middleware.ts
3. app/admin/login/page.tsx
4. app/admin/page.tsx
5. app/globals.css

Then commit changes on GitHub. Vercel will redeploy.
