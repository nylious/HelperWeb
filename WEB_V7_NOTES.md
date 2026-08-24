# V7 Notes

## Weapon Generator
The public weapon generator was rebuilt from the original Helper weapon logic:

- Normal Weapons: degree + seal + plus system
- Nova Weapons: same Normal/Nova console system
- Egy Normal Weapons: separate simple chat-command system
- EU / CH weapon mappings come from the original MainForm
- Normal/Nova output uses `/MAKEITEM ITEM_...`
- Egy output uses `!Weapon ...`
- Plus values: 1-12 and 255

## Homepage
Admin Settings now includes editable destinations for both homepage CTA buttons.
Internal paths such as `/section/console` work directly; `http://` and `https://`
links open in a new tab.

## Navigation
Section navigation is now placed between the page header and the browser/generator,
so Back + section shortcuts are always directly above the search/content area.

## Visual pass
Public helper spacing, browser proportions, generator cards, and responsive layout
were tightened to match the admin dashboard's visual quality while keeping the
Gold / Black identity.
