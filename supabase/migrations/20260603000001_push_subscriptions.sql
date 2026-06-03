create table push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz not null default now()
);

alter table push_subscriptions enable row level security;

-- Anyone can subscribe (volunteer devices call /api/subscribe without auth)
create policy "public insert" on push_subscriptions
  for insert with check (true);

-- Only service role reads (used by /api/trigger-alert on the server)
create policy "service role select" on push_subscriptions
  for select using (auth.role() = 'service_role');

-- Allow devices to delete their own subscription by endpoint
create policy "public delete by endpoint" on push_subscriptions
  for delete using (true);
