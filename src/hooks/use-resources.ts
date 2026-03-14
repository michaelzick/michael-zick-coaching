import { useQuery } from '@tanstack/react-query';
import { fetchResources, fetchResourceBySlug } from '@/lib/api/resources';

export function useResources() {
  return useQuery({
    queryKey: ['resources'],
    queryFn: fetchResources,
  });
}

export function useResourceBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['resource', slug],
    queryFn: () => fetchResourceBySlug(slug!),
    enabled: !!slug,
  });
}
