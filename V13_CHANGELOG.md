# V13 Change Log

Added non-destructive visibility controls.

## Admin
- Hide/show an entire section from the public Helper.
- Hide/show an individual command without deleting it.
- Hidden entries are clearly marked in the editor.
- Hidden sections remain available to the admin.

## Public Helper
- Hidden sections are removed from navigation and routing.
- Hidden commands are removed from category lists and search results.
- Categories with no visible commands are automatically omitted.
- Realtime catalog refresh respects visibility.

## Database
Run `supabase/upgrade_v13.sql` once.
It adds only `is_visible` booleans to `sections` and `entries`.
No existing catalog data is deleted or rewritten.
