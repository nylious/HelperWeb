-- Damanhour City GM Helper v2 database upgrade
-- Run this once on an existing project that already ran setup.sql.

alter table public.profiles
  add column if not exists display_name text not null default '';

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  logo_url text not null default '/brand-mark.svg',
  hero_overline text not null default 'GM COMMANDS / CODES',
  hero_title_line1 text not null default 'Everything your GM needs.',
  hero_title_line2 text not null default 'One clean place.',
  hero_title_line3 text not null default '',
  hero_description text not null default 'Fast command lookup, unique spawners and item generators — organized exactly around the Damanhour City GM workflow.',
  live_title text not null default 'LIVE KNOWLEDGE BASE',
  live_description text not null default 'One live catalog for the GM team. Admin changes are reflected from the central database instead of waiting for a desktop rebuild.',
  primary_button_label text not null default 'Open Console Commands',
  secondary_button_label text not null default 'Browse Discord',
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;
alter table public.site_settings enable row level security;
drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read on public.site_settings for select to anon, authenticated using (true);
drop policy if exists site_settings_admin_write on public.site_settings;
create policy site_settings_admin_write on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
insert into storage.buckets (id, name, public) values ('site-assets','site-assets',true) on conflict (id) do update set public = excluded.public;

do $$
begin
  alter publication supabase_realtime add table public.site_settings;
exception when duplicate_object then null;
end $$;

-- Account editor: allow an authenticated admin to update only their own profile row.
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update
on public.profiles
for update
to authenticated
using (id = auth.uid() and public.is_admin())
with check (id = auth.uid() and public.is_admin());

grant select, update on public.profiles to authenticated;
