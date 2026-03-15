
export type Course = {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  instructorAvatar?: string;
  coachId: string | null;
  category: CourseCategory;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  price: number;
  salePrice?: number;
  rating: number;
  ratingCount: number;
  studentsCount: number;
  duration: string;
  lectureCount: number;
  description: string;
  shortDescription: string;
  thumbnailUrl: string;
  featured?: boolean;
  bestseller?: boolean;
  lastUpdated: string;
  language: string;
  topics: string[];
  whatYouWillLearn: string[];
};

export type CourseCategory = 
  | 'nice-guy-recovery' 
  | 'relationship-skills' 
  | 'boundaries-communication' 
  | 'self-worth-identity';

export type CartItem = {
  courseId: string;
};
