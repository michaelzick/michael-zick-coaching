import { supabase } from '@/lib/supabase';
import type { Coach, CoachSummary } from '@/types/coach';
import type { Course } from '@/types/course';
import type { DbCoach, DbCourse } from '@/types/database';
import { mapDbCourseToCourse } from '@/lib/api/courses';

function mapDbCoachToCoachSummary(db: DbCoach): CoachSummary {
  return {
    id: db.id,
    slug: db.slug,
    firstName: db.first_name,
    lastName: db.last_name,
    name: `${db.first_name} ${db.last_name}`.trim(),
    title: db.title,
    shortBio: db.short_bio,
    imageUrl: db.image_url,
    bookingUrl: db.booking_url,
    websiteUrl: db.website_url,
    featured: db.featured,
    published: db.published,
  };
}

export function mapDbCoachToCoach(db: DbCoach): Coach {
  return {
    ...mapDbCoachToCoachSummary(db),
    email: db.email,
    bio: db.bio,
    philosophy: db.philosophy ?? [],
    socialLinks: db.social_links ?? {},
    testimonials: db.testimonials ?? [],
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

export async function fetchCoaches(): Promise<CoachSummary[]> {
  const { data, error } = await supabase
    .from('coaches')
    .select('*')
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('last_name', { ascending: true });

  if (error) throw error;
  return (data as DbCoach[]).map(mapDbCoachToCoachSummary);
}

export async function fetchCoachBySlug(slug: string): Promise<Coach | null> {
  const { data, error } = await supabase
    .from('coaches')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return mapDbCoachToCoach(data as DbCoach);
}

export async function fetchCoachById(id: string): Promise<Coach | null> {
  const { data, error } = await supabase
    .from('coaches')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return mapDbCoachToCoach(data as DbCoach);
}

export async function fetchFeaturedCoaches(): Promise<CoachSummary[]> {
  const { data, error } = await supabase
    .from('coaches')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('last_name', { ascending: true })
    .limit(6);

  if (error) throw error;
  return (data as DbCoach[]).map(mapDbCoachToCoachSummary);
}

export async function fetchCoachCourses(coachId: string): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .eq('coach_id', coachId)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as DbCourse[]).map(mapDbCourseToCourse);
}
