-- Add incident status lifecycle and AI-recommended skills
alter table disasters
  add column if not exists status text not null default 'ACTIVE'
    check (status in ('ACTIVE', 'RESOLVED', 'FALSE_ALARM')),
  add column if not exists recommended_skills text not null default '';

-- Allow coordinators (authenticated users) to update status
create policy "auth update disasters status" on disasters
  for update using (true) with check (true);
