export type CoachIcon = 'Target' | 'Shield' | 'Heart' | 'Mountain' | 'Users' | 'Star';

export type CoachPhilosophyItem = {
  title: string;
  description: string;
  icon: CoachIcon;
};

export type CoachTestimonial = {
  name: string;
  text: string;
};

export type CoachSocialLinks = Record<string, string>;

export type CoachSummary = {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  name: string;
  title: string;
  shortBio: string;
  imageUrl: string | null;
  bookingUrl: string | null;
  websiteUrl: string | null;
  featured: boolean;
  published: boolean;
};

export type Coach = CoachSummary & {
  email: string | null;
  bio: string;
  philosophy: CoachPhilosophyItem[];
  socialLinks: CoachSocialLinks;
  testimonials: CoachTestimonial[];
  createdAt: string;
  updatedAt: string;
};

export type AdminCoach = Coach & {
  courseCount: number;
};
