import { supabase } from '@/lib/supabase';
import { DbCourse } from '@/types/database';

export async function fetchDashboardStats() {
  const [coursesRes, enrollmentsRes, revenueRes, recentOrdersRes] = await Promise.all([
    supabase.from('courses').select('id', { count: 'exact', head: true }),
    supabase.from('enrollments').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('amount_total').eq('status', 'completed'),
    supabase.from('orders').select('*, profiles:user_id(first_name, last_name)').order('created_at', { ascending: false }).limit(10),
  ]);

  const totalRevenue = (revenueRes.data ?? []).reduce(
    (sum, o) => sum + Number(o.amount_total), 0
  );

  return {
    totalCourses: coursesRes.count ?? 0,
    totalEnrollments: enrollmentsRes.count ?? 0,
    totalRevenue,
    recentOrders: recentOrdersRes.data ?? [],
  };
}

export async function fetchAllCoursesAdmin() {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as DbCourse[];
}

export async function createCourse(course: Partial<DbCourse>) {
  const { data, error } = await supabase
    .from('courses')
    .insert(course)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCourse(id: string, updates: Partial<DbCourse>) {
  const { data, error } = await supabase
    .from('courses')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCourse(id: string) {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw error;
}

export async function createChapter(chapter: { course_id: string; title: string; description?: string; sort_order: number }) {
  const { data, error } = await supabase.from('chapters').insert(chapter).select().single();
  if (error) throw error;
  return data;
}

export async function updateChapter(id: string, updates: { title?: string; description?: string; sort_order?: number }) {
  const { data, error } = await supabase.from('chapters').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteChapter(id: string) {
  const { error } = await supabase.from('chapters').delete().eq('id', id);
  if (error) throw error;
}

export async function createLesson(lesson: {
  chapter_id: string;
  title: string;
  description?: string;
  sort_order: number;
  duration_seconds: number;
  video_source_type: string;
  video_url?: string;
  scorm_package_url?: string;
  xapi_endpoint?: string;
  xapi_activity_id?: string;
  is_preview?: boolean;
}) {
  const { data, error } = await supabase.from('lessons').insert(lesson).select().single();
  if (error) throw error;
  return data;
}

export async function updateLesson(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase.from('lessons').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteLesson(id: string) {
  const { error } = await supabase.from('lessons').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, courses(title))')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}
