import { useQuery } from '@tanstack/react-query';
import {
  fetchCoachById,
  fetchCoachBySlug,
  fetchCoachCourses,
  fetchCoaches,
  fetchFeaturedCoaches,
} from '@/lib/api/coaches';

export function useCoaches() {
  return useQuery({
    queryKey: ['coaches'],
    queryFn: fetchCoaches,
  });
}

export function useCoachBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['coach', slug],
    queryFn: () => fetchCoachBySlug(slug!),
    enabled: !!slug,
  });
}

export function useCoachById(id: string | null | undefined) {
  return useQuery({
    queryKey: ['coach', 'byId', id],
    queryFn: () => fetchCoachById(id!),
    enabled: !!id,
  });
}

export function useFeaturedCoaches() {
  return useQuery({
    queryKey: ['coaches', 'featured'],
    queryFn: fetchFeaturedCoaches,
  });
}

export function useCoachCourses(coachId: string | undefined) {
  return useQuery({
    queryKey: ['coaches', coachId, 'courses'],
    queryFn: () => fetchCoachCourses(coachId!),
    enabled: !!coachId,
  });
}
