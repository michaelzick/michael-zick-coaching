export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: 'student' | 'admin';
  createdAt: string;
  updatedAt: string;
};

export type DbCourse = {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  instructor_avatar: string | null;
  category: string;
  level: string;
  price: number;
  sale_price: number | null;
  rating: number;
  rating_count: number;
  students_count: number;
  duration: string;
  lecture_count: number;
  description: string;
  short_description: string;
  thumbnail_url: string;
  featured: boolean;
  bestseller: boolean;
  last_updated: string;
  language: string;
  topics: string[];
  what_you_will_learn: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type DbChapter = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
};

export type VideoSourceType = 'self_hosted' | 'youtube' | 'vimeo' | 's3' | 'scorm' | 'xapi';

export type DbLesson = {
  id: string;
  chapter_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  duration_seconds: number;
  video_source_type: VideoSourceType;
  video_url: string | null;
  video_s3_key: string | null;
  scorm_package_url: string | null;
  xapi_endpoint: string | null;
  xapi_activity_id: string | null;
  is_preview: boolean;
  created_at: string;
};

export type DbEnrollment = {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  stripe_payment_intent_id: string | null;
};

export type DbLessonProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  progress_percent: number;
  last_position_seconds: number;
  xapi_statement: Record<string, unknown> | null;
  scorm_data: Record<string, unknown> | null;
  updated_at: string;
};

export type DbOrder = {
  id: string;
  user_id: string;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  amount_total: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
};

export type DbOrderItem = {
  id: string;
  order_id: string;
  course_id: string;
  price_paid: number;
};
