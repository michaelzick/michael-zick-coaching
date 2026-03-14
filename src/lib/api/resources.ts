import { supabase } from '@/lib/supabase';

export interface Resource {
  id: string;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  content: string;
  author: string;
  category: string | null;
  relatedCourseSlug: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DbResource {
  id: string;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  content: string;
  author: string;
  category: string | null;
  related_course_slug: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

function mapDbResource(db: DbResource): Resource {
  return {
    id: db.id,
    slug: db.slug,
    title: db.title,
    metaTitle: db.meta_title,
    metaDescription: db.meta_description,
    content: db.content,
    author: db.author,
    category: db.category,
    relatedCourseSlug: db.related_course_slug,
    published: db.published,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

export async function fetchResources(): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapDbResource);
}

export async function fetchResourceBySlug(slug: string): Promise<Resource | null> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw error;
  }
  return data ? mapDbResource(data) : null;
}
