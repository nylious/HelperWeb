Repair 1

Two independent issues were fixed:

1. Public/helper styling:
   app/globals.css was restored to the original helper/public stylesheet,
   then the new admin dashboard/login styles were appended. This avoids
   destroying the public Helper layout.

2. Admin authentication setup:
   supabase/schema.sql now includes an Auth-user -> profiles trigger.
   The existing account still needs the one-time SQL in ADMIN_SETUP.txt
   to become role = 'admin'.

Replace/update these in GitHub:
- app/globals.css
- supabase/schema.sql

Run the SQL migration in Supabase before testing /admin.
Then set the existing user's role to admin using the SQL in ADMIN_SETUP.txt.
