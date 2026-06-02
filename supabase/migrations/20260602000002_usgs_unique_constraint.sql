-- Unique constraint so USGS seed can upsert without creating duplicates
alter table disasters
  add constraint disasters_title_created_at_unique unique (title, created_at);
