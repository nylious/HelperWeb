# V7 Deployment

1. Upload the full project over the existing GitHub repository and commit the changes.
2. In Supabase SQL Editor run once:
   `supabase/upgrade_v7.sql`
3. Vercel will redeploy from the new GitHub commit.

Existing catalog data is not reset by V7.
