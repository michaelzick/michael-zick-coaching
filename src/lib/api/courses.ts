import { supabase } from '@/lib/supabase';
import { Course } from '@/types/course';
import { DbCourse, DbChapter, DbLesson } from '@/types/database';

function mapDbCourseToCourse(db: DbCourse): Course {
  return {
    id: db.id,
    title: db.title,
    slug: db.slug,
    instructor: db.instructor,
    instructorAvatar: db.instructor_avatar ?? undefined,
    category: db.category as Course['category'],
    level: db.level as Course['level'],
    price: Number(db.price),
    salePrice: db.sale_price ? Number(db.sale_price) : undefined,
    rating: Number(db.rating),
    ratingCount: db.rating_count,
    studentsCount: db.students_count,
    duration: db.duration,
    lectureCount: db.lecture_count,
    description: db.description,
    shortDescription: db.short_description,
    thumbnailUrl: db.thumbnail_url,
    featured: db.featured,
    bestseller: db.bestseller,
    lastUpdated: db.last_updated,
    language: db.language,
    topics: db.topics,
    whatYouWillLearn: db.what_you_will_learn,
  };
}

export async function fetchCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as DbCourse[]).map(mapDbCourseToCourse);
}

export async function fetchAllCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as DbCourse[]).map(mapDbCourseToCourse);
}

export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return mapDbCourseToCourse(data as DbCourse);
}

export async function fetchCoursesByIds(ids: string[]): Promise<Course[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .in('id', ids);

  if (error) throw error;
  return (data as DbCourse[]).map(mapDbCourseToCourse);
}

export async function fetchFeaturedCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .limit(3);

  if (error) throw error;
  return (data as DbCourse[]).map(mapDbCourseToCourse);
}

export type ChapterWithLessons = {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  lessons: LessonItem[];
};

export type LessonItem = {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  durationSeconds: number;
  videoSourceType: DbLesson['video_source_type'];
  videoUrl: string | null;
  scormPackageUrl: string | null;
  xapiEndpoint: string | null;
  xapiActivityId: string | null;
  isPreview: boolean;
};

export async function fetchCourseChapters(courseId: string): Promise<ChapterWithLessons[]> {
  const { data: chapters, error: chapError } = await supabase
    .from('chapters')
    .select('*')
    .eq('course_id', courseId)
    .order('sort_order');

  if (chapError) throw chapError;

  const { data: lessons, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .in('chapter_id', (chapters as DbChapter[]).map(c => c.id))
    .order('sort_order');

  if (lessonError) throw lessonError;

  return (chapters as DbChapter[]).map(ch => ({
    id: ch.id,
    title: ch.title,
    description: ch.description,
    sortOrder: ch.sort_order,
    lessons: (lessons as DbLesson[])
      .filter(l => l.chapter_id === ch.id)
      .map(l => ({
        id: l.id,
        title: l.title,
        description: l.description,
        sortOrder: l.sort_order,
        durationSeconds: l.duration_seconds,
        videoSourceType: l.video_source_type,
        videoUrl: l.video_url,
        scormPackageUrl: l.scorm_package_url,
        xapiEndpoint: l.xapi_endpoint,
        xapiActivityId: l.xapi_activity_id,
        isPreview: l.is_preview,
      })),
  }));
}

export async function fetchRelatedCourses(courseId: string, category: string, limit = 4): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .neq('id', courseId)
    .limit(limit);

  if (error) throw error;
  return (data as DbCourse[]).map(mapDbCourseToCourse);
}
