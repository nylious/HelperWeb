# V7 CHANGELOG

### Weapon system restored
The public generator no longer treats Normal, Nova and Egy as the same system.
The implementation mirrors the original Helper source:
- Normal / Nova: EU/CH + weapon + degree D1-D11 + seal/type + plus 1-12/255.
- Egy Normal: EU/CH + weapon + plus 1-12/255, using the original chat command format.
The weapon mappings and generated `/MAKEITEM` structure are based on the original
MainForm weapon logic in the source shared for this project. See the original
source references in the project review.

### Homepage CTA destinations
Added:
- Primary button destination
- Secondary button destination
These can be internal routes or http/https URLs and are saved in Supabase.

### Helper navigation
The Back button and four section shortcuts now sit directly above the search/content area,
not only inside the Admin panel.

### Public visual pass
Improved shell widths, cards, spacing, responsive layout, browser columns and generator
cards to align with the Admin panel's Gold / Black visual language.
