-- GROUP BY aggregations pushed to the database layer for dashboard analytics.
-- These replace full-table JS loops in /api/dashboard/route.ts.

create or replace function count_by_severity()
returns table(severity text, count bigint)
language sql
security definer
as $$
  select coalesce(severity, 'UNKNOWN') as severity, count(*) as count
  from disasters
  group by coalesce(severity, 'UNKNOWN');
$$;

create or replace function count_by_status()
returns table(status text, count bigint)
language sql
security definer
as $$
  select coalesce(status, 'ACTIVE') as status, count(*) as count
  from disasters
  group by coalesce(status, 'ACTIVE');
$$;
