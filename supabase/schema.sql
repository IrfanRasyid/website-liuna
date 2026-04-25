-- ============================================================
--  RYUTA AMAGIRI — Supabase Schema
--  Run this in your Supabase project's SQL Editor
--  Dashboard → SQL Editor → New Query → paste & run
-- ============================================================


-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";


-- ============================================================
-- 2. TABLE: fan_arts
--    Stores fan art submissions shown in the Fan Art Gallery
-- ============================================================
create table if not exists public.fan_arts (
  id           uuid primary key default uuid_generate_v4(),
  title        text        not null,
  artist_name  text,                          -- nullable: anonymous allowed
  image_url    text        not null,          -- public URL from Storage or external
  source_url   text,                          -- optional link to artist's page / tweet
  approved     boolean     not null default false,  -- admin must approve before showing
  created_at   timestamptz not null default now()
);

comment on table  public.fan_arts              is 'Fan art submissions for Ryuta Amagiri portfolio';
comment on column public.fan_arts.approved     is 'Only approved rows are returned to the public site';
comment on column public.fan_arts.image_url    is 'Direct public URL of the artwork image';
comment on column public.fan_arts.source_url   is 'Link back to the original post (Twitter, Pixiv, etc.)';


-- ============================================================
-- 3. TABLE: schedule
--    Stores upcoming stream schedule entries
-- ============================================================
create table if not exists public.schedule (
  id            uuid primary key default uuid_generate_v4(),
  title         text        not null,
  game          text        not null default 'Just Chatting',
  description   text,                          -- optional extra notes
  scheduled_at  timestamptz not null,          -- WIB time stored as UTC
  duration_min  integer,                       -- expected stream length in minutes
  thumbnail_url text,                          -- optional custom thumbnail
  stream_url    text,                          -- YouTube stream link when live
  status        text        not null default 'upcoming'
                check (status in ('upcoming', 'live', 'ended', 'cancelled')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table  public.schedule              is 'Upcoming and past stream schedule';
comment on column public.schedule.scheduled_at is 'Stored as UTC. Site displays in WIB (UTC+7)';
comment on column public.schedule.status       is 'upcoming | live | ended | cancelled';


-- ============================================================
-- 4. AUTO-UPDATE updated_at ON schedule
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists schedule_set_updated_at on public.schedule;
create trigger schedule_set_updated_at
  before update on public.schedule
  for each row execute procedure public.set_updated_at();


-- ============================================================
-- 5. INDEXES
-- ============================================================
create index if not exists fan_arts_created_at_idx
  on public.fan_arts (created_at desc);

create index if not exists fan_arts_approved_idx
  on public.fan_arts (approved)
  where approved = true;

create index if not exists schedule_scheduled_at_idx
  on public.schedule (scheduled_at asc);

create index if not exists schedule_status_idx
  on public.schedule (status);


-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on both tables
alter table public.fan_arts enable row level security;
alter table public.schedule  enable row level security;


-- ── fan_arts policies ──────────────────────────────────────

-- Public: anyone can read approved fan arts
create policy "fan_arts: public read approved"
  on public.fan_arts for select
  using (approved = true);

-- Anon: anyone can insert (fan art submission form)
create policy "fan_arts: public insert"
  on public.fan_arts for insert
  with check (true);

-- Admin (authenticated users): can read, update, delete all rows
create policy "fan_arts: admin full access"
  on public.fan_arts for all
  using (auth.role() = 'authenticated');


-- ── schedule policies ──────────────────────────────────────

-- Public: anyone can read schedule entries that are not cancelled
create policy "schedule: public read"
  on public.schedule for select
  using (status != 'cancelled');

-- Admin: can read/write everything
create policy "schedule: admin full access"
  on public.schedule for all
  using (auth.role() = 'authenticated');


-- ============================================================
-- 7. STORAGE BUCKET: fan-art
--    For hosting uploaded fan art images
-- ============================================================

-- Create the bucket (idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'fan-art',
  'fan-art',
  true,                           -- public bucket — URLs are openly accessible
  5242880,                        -- 5 MB max per file
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
on conflict (id) do nothing;

-- Allow anyone to read (view) files in the bucket
create policy "fan-art bucket: public read"
  on storage.objects for select
  using (bucket_id = 'fan-art');

-- Allow anyone to upload (submit fan art)
create policy "fan-art bucket: public upload"
  on storage.objects for insert
  with check (bucket_id = 'fan-art');

-- Allow authenticated users (admin) to delete/update files
create policy "fan-art bucket: admin manage"
  on storage.objects for all
  using (bucket_id = 'fan-art' and auth.role() = 'authenticated');


-- ============================================================
-- 8. SEED DATA — Fan Arts (sample, approved)
-- ============================================================
insert into public.fan_arts (title, artist_name, image_url, source_url, approved) values
  ('Ryuta in Snowstorm',   'IceArtist',    'https://picsum.photos/seed/fa1/400/500', null, true),
  ('Oni Dragon Form',      'DragonSketch', 'https://picsum.photos/seed/fa2/400/600', null, true),
  ('Chibi Ryuta ❄️',      'ChibiArts',    'https://picsum.photos/seed/fa3/400/400', null, true),
  ('Mountain Peak',        'MountainDraw', 'https://picsum.photos/seed/fa4/400/550', null, true),
  ('Ryuta Full Art',       'FullColorArt', 'https://picsum.photos/seed/fa5/400/480', null, true),
  ('Snow Night',           'NightArts',    'https://picsum.photos/seed/fa6/400/520', null, true)
on conflict do nothing;


-- ============================================================
-- 9. SEED DATA — Schedule (sample upcoming streams)
--    Dates are set relative to the current time so they appear
--    correctly as "upcoming" when you first run this script.
-- ============================================================
insert into public.schedule (title, game, scheduled_at, duration_min, status) values
  (
    'Late Night Minecraft',
    'Minecraft',
    (now() + interval '6 hours')::timestamptz,
    120,
    'upcoming'
  ),
  (
    'Ranked Apex with Friends',
    'Apex Legends',
    (now() + interval '30 hours')::timestamptz,
    180,
    'upcoming'
  ),
  (
    'Chill Zatsu Talk ☕',
    'Just Chatting',
    (now() + interval '54 hours')::timestamptz,
    90,
    'upcoming'
  ),
  (
    'Genshin Exploration',
    'Genshin Impact',
    (now() + interval '78 hours')::timestamptz,
    150,
    'upcoming'
  )
on conflict do nothing;


-- ============================================================
-- 10. HELPFUL VIEWS (optional)
-- ============================================================

-- Public-safe view of fan arts (only approved)
create or replace view public.fan_arts_public as
  select id, title, artist_name, image_url, source_url, created_at
  from public.fan_arts
  where approved = true
  order by created_at desc;

-- Upcoming streams only
create or replace view public.schedule_upcoming as
  select *
  from public.schedule
  where scheduled_at >= now()
    and status in ('upcoming', 'live')
  order by scheduled_at asc
  limit 8;


-- ============================================================
-- 11. VERIFICATION QUERIES
--    Run these after the script to confirm everything worked
-- ============================================================

-- select * from public.fan_arts;
-- select * from public.schedule;
-- select * from public.fan_arts_public;
-- select * from public.schedule_upcoming;
