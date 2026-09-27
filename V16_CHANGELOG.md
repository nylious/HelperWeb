# V16 - Native EN/TR language selector

- Removed Google Translate completely.
- Added a native EN / TR selector in the header.
- Header/brand stays English and is never machine-translated.
- Command names and command codes are NEVER translated.
- Category and section labels can switch to Turkish.
- Existing command descriptions have local Turkish translations for the current catalog.
- Dynamic descriptions are translated when a command is selected, without DOM translation hacks.
- Language choice is saved in localStorage.
- No Supabase SQL migration is required for this language-selector change.
