import { supabase } from '@/lib/supabase';

export async function updateLessonProgress(
  lessonId: string,
  data: {
    completed?: boolean;
    progressPercent?: number;
    lastPositionSeconds?: number;
    xapiStatement?: Record<string, unknown>;
    scormData?: Record<string, unknown>;
  }
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('lesson_progress')
    .upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed: data.completed ?? false,
        progress_percent: data.progressPercent ?? 0,
        last_position_seconds: data.lastPositionSeconds ?? 0,
        xapi_statement: data.xapiStatement ?? null,
        scorm_data: data.scormData ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    );

  if (error) throw error;
}

export async function fetchCourseProgress(courseId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('lesson_progress')
    .select(`
      *,
      lessons!inner (
        chapter_id,
        chapters!inner (
          course_id
        )
      )
    `)
    .eq('user_id', user.id)
    .eq('lessons.chapters.course_id', courseId);

  if (error) throw error;
  return data ?? [];
}

export async function fetchLessonProgress(lessonId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}
