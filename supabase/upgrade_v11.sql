-- Damanhour City GM Helper V11
-- Fixes homepage/header settings saves and logo/header-icon persistence.
-- Safe to run once; every statement is idempotent.

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1)
);

alter table public.site_settings
  add column if not exists logo_url text not null default '/brand-mark.svg',
  add column if not exists header_icon_url text not null default '/brand-mark.svg',
  add column if not exists hero_overline text not null default 'GM COMMANDS / CODES',
  add column if not exists hero_title_line1 text not null default 'Everything your GM needs.',
  add column if not exists hero_title_line2 text not null default 'One clean place.',
  add column if not exists hero_title_line3 text not null default '',
  add column if not exists hero_description text not null default 'Fast command lookup, unique spawners and item generators — organized exactly around the Damanhour City GM workflow.',
  add column if not exists live_title text not null default 'LIVE KNOWLEDGE BASE',
  add column if not exists live_description text not null default 'One live catalog for the GM team. Admin changes are reflected from the central database instead of waiting for a desktop rebuild.',
  add column if not exists primary_button_label text not null default 'Open Console Commands',
  add column if not exists secondary_button_label text not null default 'Browse Discord',
  add column if not exists primary_button_href text not null default '/section/console',
  add column if not exists secondary_button_href text not null default '/section/discord',
  add column if not exists updated_at timestamptz not null default now();

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

update public.site_settings
set
  logo_url = coalesce(nullif(logo_url, ''), '/brand-mark.svg'),
  header_icon_url = coalesce(nullif(header_icon_url, ''), '/brand-mark.svg'),
  hero_overline = coalesce(nullif(hero_overline, ''), 'GM COMMANDS / CODES'),
  hero_title_line1 = coalesce(nullif(hero_title_line1, ''), 'Everything your GM needs.'),
  hero_title_line2 = coalesce(nullif(hero_title_line2, ''), 'One clean place.'),
  primary_button_href = coalesce(nullif(primary_button_href, ''), '/section/console'),
  secondary_button_href = coalesce(nullif(secondary_button_href, ''), '/section/discord')
where id = 1;

alter table public.site_settings enable row level security;

drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists site_settings_admin_write on public.site_settings;
create policy site_settings_admin_write
on public.site_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;

-- Keep the storage bucket compatible with the current uploader.
insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
values (
  'site-assets',
  'site-assets',
  true,
  5242880,
  array[
    'image/png',
    'image/svg+xml',
    'image/jpeg',
    'image/jpg',
    'image/webp'
  ]::text[]
)
on conflict (id) do update
set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = excluded.allowed_mime_types;
