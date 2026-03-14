-- Resources table for SEO/AEO content pages
-- These are long-form informational articles that capture search traffic

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  meta_title text,
  meta_description text,
  content text not null default '',
  author text not null default 'Michael Zick',
  category text,
  related_course_slug text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.resources enable row level security;

-- Public read access for published resources
create policy "Published resources are viewable by everyone"
  on public.resources
  for select
  using (published = true);

-- Admin full access
create policy "Admins can manage resources"
  on public.resources
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Index for slug lookups
create index if not exists idx_resources_slug on public.resources (slug);
create index if not exists idx_resources_published on public.resources (published);

-- Auto-update updated_at
create or replace function update_resources_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger resources_updated_at
  before update on public.resources
  for each row
  execute function update_resources_updated_at();
