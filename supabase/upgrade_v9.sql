-- Damanhour City GM Helper V9
-- Adds an independently editable header/navigation icon.

alter table public.site_settings
  add column if not exists header_icon_url text not null default '/brand-mark.svg';

update public.site_settings
set header_icon_url = coalesce(nullif(header_icon_url, ''), '/brand-mark.svg')
where id = 1;

-- Allow SVG uploads in the shared public site-assets bucket.
update storage.buckets
set allowed_mime_types = array[
  'image/png',
  'image/svg+xml',
  'image/jpeg',
  'image/jpg',
  'image/webp'
]::text[]
where id = 'site-assets';
