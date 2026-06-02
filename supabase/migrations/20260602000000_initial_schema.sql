-- SurgeAid initial schema
-- Run this in your Supabase SQL editor or via `supabase db push`

create table if not exists volunteers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  skills      text not null default '',
  subscribed  boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists disasters (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  lat         double precision,
  lng         double precision,
  severity    text check (severity in ('CRITICAL','HIGH','MEDIUM','LOW','UNKNOWN')),
  action      text,
  created_at  timestamptz not null default now()
);

-- Full-text search index on disasters (used by future /alerts search feature)
create index if not exists disasters_fts_idx
  on disasters using gin (to_tsvector('english', title || ' ' || description));

-- Enable Row Level Security
alter table volunteers enable row level security;
alter table disasters enable row level security;

-- Public read access for both tables (volunteers join + map/feed display)
create policy "public read volunteers"  on volunteers for select using (true);
create policy "public read disasters"   on disasters  for select using (true);

-- Anyone can insert (volunteer signup and incident report are public-facing forms)
create policy "public insert volunteers" on volunteers for insert with check (true);
create policy "public insert disasters"  on disasters  for insert with check (true);
