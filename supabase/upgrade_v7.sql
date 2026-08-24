-- Damanhour City GM Helper V7
-- Adds editable homepage button destinations.

alter table public.site_settings
  add column if not exists primary_button_href text not null default '/section/console',
  add column if not exists secondary_button_href text not null default '/section/discord';

update public.site_settings
set
  primary_button_href = coalesce(nullif(primary_button_href, ''), '/section/console'),
  secondary_button_href = coalesce(nullif(secondary_button_href, ''), '/section/discord')
where id = 1;
