create table if not exists public.coaches (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  first_name text not null,
  last_name text not null,
  email text unique,
  title text not null,
  bio text not null default '',
  short_bio text not null default '',
  philosophy jsonb not null default '[]'::jsonb,
  image_url text,
  booking_url text,
  website_url text,
  social_links jsonb not null default '{}'::jsonb,
  testimonials jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_coaches_published on public.coaches (published);
create index if not exists idx_coaches_featured on public.coaches (featured);

alter table public.coaches enable row level security;

drop policy if exists "Published coaches are viewable by everyone" on public.coaches;
create policy "Published coaches are viewable by everyone"
  on public.coaches
  for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Admins can manage coaches" on public.coaches;
create policy "Admins can manage coaches"
  on public.coaches
  for all
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create or replace function public.update_coaches_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists coaches_updated_at on public.coaches;
create trigger coaches_updated_at
  before update on public.coaches
  for each row
  execute function public.update_coaches_updated_at();

alter table public.courses
  add column if not exists coach_id uuid references public.coaches(id) on delete set null;

create index if not exists idx_courses_coach_id on public.courses (coach_id);

insert into storage.buckets (id, name, public)
values ('coach-images', 'coach-images', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Coach images are viewable by everyone" on storage.objects;
create policy "Coach images are viewable by everyone"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'coach-images');

drop policy if exists "Admins can upload coach images" on storage.objects;
create policy "Admins can upload coach images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'coach-images'
    and exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can update coach images" on storage.objects;
create policy "Admins can update coach images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'coach-images'
    and exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  )
  with check (
    bucket_id = 'coach-images'
    and exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can delete coach images" on storage.objects;
create policy "Admins can delete coach images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'coach-images'
    and exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

insert into public.coaches (
  id,
  slug,
  first_name,
  last_name,
  email,
  title,
  bio,
  short_bio,
  philosophy,
  image_url,
  booking_url,
  website_url,
  social_links,
  testimonials,
  featured,
  published
)
values (
  '11111111-1111-1111-1111-111111111111',
  'michael-zick',
  'Michael',
  'Zick',
  'coach@michaelzick.com',
  'Founder and Nice Guy Recovery Coach',
  $$For most of my life, I was a textbook Nice Guy. I said yes when I meant no. I performed for approval. I built covert contracts in every relationship, then resented people when they failed to honor agreements they never actually made.

The turning point came when I realized my "niceness" was not generosity. It was a survival strategy I built as a kid to avoid conflict and earn love. Once I saw the pattern clearly, I could not unsee it.

I spent years doing the work: examining my parental relationships, learning to tolerate displeasure, setting boundaries I had never set before, and building an identity based on my actual values instead of whatever I thought would make people like me.

Now I coach men through the same process with a direct, structured approach. No vague platitudes. No performative motivation. Just clear frameworks, honest feedback, and practical work that changes how you show up in your relationships and your life.$$,
  'Michael helps men break approval addiction, stop performing for validation, and build lives anchored in standards, honesty, and self-respect.',
  '[
    {"title":"Radical Honesty","description":"Stop performing. Start telling the truth to yourself and the people around you.","icon":"Target"},
    {"title":"Displeasure Tolerance","description":"Build the capacity to handle negative reactions without collapsing or caving.","icon":"Shield"},
    {"title":"Standards Over Scarcity","description":"Make decisions from abundance and self-respect, not fear of being alone.","icon":"Heart"},
    {"title":"Staying in the Discomfort","description":"Growth happens in the space between the old pattern and the new behavior.","icon":"Mountain"}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
  'https://calendly.com',
  'https://www.michaelzick.com',
  '{"website":"https://www.michaelzick.com"}'::jsonb,
  '[
    {"name":"Ryan I.","text":"Working with Michael completely changed how I show up in my relationships. I stopped performing and started being real. My marriage has never been better."},
    {"name":"Doug S.","text":"I did not even realize I was a Nice Guy until Michael broke it down. Now I have boundaries, I communicate directly, and I do not resent the people I love anymore."},
    {"name":"Greg C.","text":"The displeasure tolerance work was a game-changer. I used to bend over backwards to avoid conflict. Now I can hold my ground and still feel calm."},
    {"name":"Earl M.","text":"Michael gave me the tools to finally deal with the patterns I picked up from childhood. I feel like I am living my own life for the first time."}
  ]'::jsonb,
  true,
  true
)
on conflict (id) do update
set slug = excluded.slug,
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    email = excluded.email,
    title = excluded.title,
    bio = excluded.bio,
    short_bio = excluded.short_bio,
    philosophy = excluded.philosophy,
    image_url = excluded.image_url,
    booking_url = excluded.booking_url,
    website_url = excluded.website_url,
    social_links = excluded.social_links,
    testimonials = excluded.testimonials,
    featured = excluded.featured,
    published = excluded.published;

update public.courses
set coach_id = '11111111-1111-1111-1111-111111111111'
where coach_id is null
  and instructor = 'Michael Zick';
