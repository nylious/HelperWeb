# V3 Changelog

- Added section shortcut cards above the admin command search.
- Added explicit Back actions on Settings and Command Manager screens.
- Fixed Settings homepage logo upload to use authenticated Supabase Storage policies instead of requiring the service-role key.
- Site settings save now uses the authenticated admin session and RLS.
- Removed editable/viewable email from the Admin account editor/menu.
- Kept Remember Me and 15-minute inactivity logout behavior.
- Corrected the weapon generator to match the original Helper: Normal = !Weapon, Nova = !Weaponrare, Egy = !Weaponegy, Plus 0-10.
- Preserved bundled catalog data and existing Supabase schema/seed.
- Added Supabase v3 storage policy upgrade script.


## V4
- Added public Helper section shortcuts and Back to Home navigation.
- Hardened PNG/JPG/JPEG/WebP logo upload and storage policies.
- Added clearer upload guidance and storage error messages.
