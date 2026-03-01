
export type Course = {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  instructorAvatar?: string;
  category: CourseCategory;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  price: number;
  salePrice?: number;
  rating: number;
  ratingCount: number;
  studentsCount: number;
  duration: string; // e.g., "20h 30m"
  lectureCount: number;
  description: string;
  shortDescription: string;
  thumbnailUrl: string;
  featured?: boolean;
  bestseller?: boolean;
  lastUpdated: string; // e.g., "March 2023"
  language: string;
  topics: string[];
  whatYouWillLearn: string[];
};

export type CourseCategory = 
  | 'development' 
  | 'business' 
  | 'design' 
  | 'marketing' 
  | 'photography' 
  | 'music' 
  | 'personal-development';

export type CartItem = {
  courseId: string;
};
