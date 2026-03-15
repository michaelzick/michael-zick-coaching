import {
  FunctionsHttpError,
  FunctionsRelayError,
} from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { mapDbCoachToCoach } from '@/lib/api/coaches';
import { AdminCoach, Coach } from '@/types/coach';
import { DbCoach, DbCourse, DbOrder } from '@/types/database';

type AdminOrderItem = {
  id: string;
  course_id: string;
  price_paid: number;
  courses: {
    title: string;
  } | null;
};

export type AdminOrder = DbOrder & {
  order_items: AdminOrderItem[] | null;
};

type RecentOrderProfile = {
  first_name: string | null;
  last_name: string | null;
};

export type RecentOrder = DbOrder & {
  profiles: RecentOrderProfile | null;
};

export type DashboardStats = {
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  recentOrders: RecentOrder[];
};

type RefundOrderPaymentResult = {
  refundId: string;
  refundStatus: string;
  orderStatus: 'refunded';
  revokedEnrollmentCount: number;
};

async function getFunctionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof FunctionsHttpError || error instanceof FunctionsRelayError) {
    try {
      const payload = await error.context.json();
      if (payload && typeof payload === 'object') {
        const message =
          ('error' in payload ? payload.error : undefined)
          ?? ('msg' in payload ? payload.msg : undefined);

        if (typeof message === 'string' && message.trim()) {
          return message;
        }
      }
    } catch {
      // Fall back to the generic message when the response body isn't JSON.
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
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
    recentOrders: (recentOrdersRes.data ?? []) as RecentOrder[],
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

export async function fetchAllCoachesAdmin(): Promise<AdminCoach[]> {
  const [coachesRes, coursesRes] = await Promise.all([
    supabase.from('coaches').select('*').order('created_at', { ascending: false }),
    supabase.from('courses').select('id, coach_id'),
  ]);

  if (coachesRes.error) throw coachesRes.error;
  if (coursesRes.error) throw coursesRes.error;

  const courseCounts = (coursesRes.data ?? []).reduce<Record<string, number>>((acc, course) => {
    if (course.coach_id) {
      acc[course.coach_id] = (acc[course.coach_id] ?? 0) + 1;
    }

    return acc;
  }, {});

  return (coachesRes.data as DbCoach[]).map((coach) => ({
    ...mapDbCoachToCoach(coach),
    courseCount: courseCounts[coach.id] ?? 0,
  }));
}

export async function fetchCoachByIdAdmin(id: string): Promise<Coach | null> {
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

export async function createCoach(coach: Partial<DbCoach>): Promise<Coach> {
  const { data, error } = await supabase
    .from('coaches')
    .insert(coach)
    .select()
    .single();

  if (error) throw error;
  return mapDbCoachToCoach(data as DbCoach);
}

export async function updateCoach(id: string, updates: Partial<DbCoach>): Promise<Coach> {
  const { data, error } = await supabase
    .from('coaches')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapDbCoachToCoach(data as DbCoach);
}

export async function deleteCoach(id: string) {
  const { error } = await supabase.from('coaches').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadCoachImage(file: File, slug: string) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeSlug = slug || `coach-${crypto.randomUUID()}`;
  const path = `${safeSlug}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from('coach-images')
    .upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from('coach-images').getPublicUrl(path);
  return data.publicUrl;
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
  content?: string;
  journal_prompts?: string[];
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
  return (data ?? []) as AdminOrder[];
}

export async function refundOrderPayment(orderId: string): Promise<RefundOrderPaymentResult> {
  try {
    const { data, error } = await supabase.functions.invoke('refund-order-payment', {
      body: { orderId },
    });

    if (error) throw error;
    return data as RefundOrderPaymentResult;
  } catch (error) {
    throw new Error(
      await getFunctionErrorMessage(
        error,
        'Unable to refund this order right now.',
      ),
    );
  }
}
