import { useQuery } from '@tanstack/react-query';
import {
  fetchCourses,
  fetchCourseBySlug,
  fetchCoursesByIds,
  fetchFeaturedCourses,
  fetchCourseChapters,
  fetchRelatedCourses,
} from '@/lib/api/courses';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });
}

export function useCourseBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: () => fetchCourseBySlug(slug!),
    enabled: !!slug,
  });
}

export function useCoursesByIds(ids: string[]) {
  return useQuery({
    queryKey: ['courses', 'byIds', ids],
    queryFn: () => fetchCoursesByIds(ids),
    enabled: ids.length > 0,
  });
}

export function useFeaturedCourses() {
  return useQuery({
    queryKey: ['courses', 'featured'],
    queryFn: fetchFeaturedCourses,
  });
}

export function useCourseChapters(courseId: string | undefined) {
  return useQuery({
    queryKey: ['chapters', courseId],
    queryFn: () => fetchCourseChapters(courseId!),
    enabled: !!courseId,
  });
}

export function useRelatedCourses(courseId: string | undefined, category: string | undefined) {
  return useQuery({
    queryKey: ['courses', 'related', courseId, category],
    queryFn: () => fetchRelatedCourses(courseId!, category!),
    enabled: !!courseId && !!category,
  });
}
