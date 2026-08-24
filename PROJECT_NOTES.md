# Final project notes

## Current design decisions
- Gold × Black is the primary visual system.
- The homepage logo is centered and gains a glow on hover.
- Homepage hero copy and logo are controlled from Supabase site settings.
- Admin account opens as a right-side slide-over drawer.
- Admin display name is shown beside “Admin” after saving.
- Remember Me persists the browser session marker across restarts.
- All admin sessions are forced out after 15 minutes without activity.
- The editor has explicit Back controls at both the top and bottom action row.
- Normal + Nova weapons use the original unified `/MAKEITEM ITEM_...` system.
- Egy Normal Weapons keep the original `!<weapon>egy <plus>` system.

## Weapon logic source
The Normal + Nova generator is based on the unified weapon logic from the original Helper source (`DamanhourCityCommands_WeaponsMerged.cs`), including:
- EU/CH weapon lists
- Degree 1–11
- Seal options changing at degree 11
- Plus 1–12 + 255
- `/MAKEITEM ITEM_{REGION}_{WEAPON}{DEGREE}_{SEAL} {PLUS}` output

The Egy generator keeps the original `currentWeaponSuffix == "egy"` behavior from the Helper.
