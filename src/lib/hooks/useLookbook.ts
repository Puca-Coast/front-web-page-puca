import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { lookbookService } from '@/lib/services/api/lookbookService';
import { queryKeys, staleTime, cacheTime, cacheInvalidation } from '../queryKeys';

// Hook para buscar fotos do lookbook com cache
export function useLookbookPhotos(page = 1, limit = 20, season = 'primavera2024') {
  return useQuery({
    queryKey: queryKeys.lookbook.photos({ page, limit, season }),
    queryFn: () => lookbookService.getPhotos(page, limit, season),
    staleTime: staleTime.LOOKBOOK,
    gcTime: cacheTime.GC_TIME,
  });
}

// Hook para lookbook com infinite scrolling
export function useInfiniteLookbook(limit = 20, season = 'primavera2024') {
  return useInfiniteQuery({
    queryKey: queryKeys.lookbook.photos({ limit, season }),
    queryFn: ({ pageParam = 1 }) => lookbookService.getPhotos(pageParam, limit, season),
    staleTime: staleTime.LOOKBOOK,
    gcTime: cacheTime.GC_TIME,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.success || !lastPage.pagination) return undefined;
      
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

// Hook para buscar todas as fotos do lookbook (sem paginação)
export function useAllLookbookPhotos(season = 'primavera2024') {
  return useQuery({
    queryKey: queryKeys.lookbook.photos({ season, all: true }),
    queryFn: () => lookbookService.getPhotos(1, 1000, season), // Buscar todas com limite alto
    staleTime: staleTime.LOOKBOOK,
    gcTime: cacheTime.GC_TIME,
  });
}

// Hook para mutations (criar, atualizar, deletar fotos do lookbook)
export function useLookbookMutations() {
  const queryClient = useQueryClient();

  const addPhotos = useMutation({
    mutationFn: lookbookService.addPhotos,
    onSuccess: () => {
      // Invalidar cache de lookbook usando invalidation helper
      cacheInvalidation.onLookbookUpdate().forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
  });

  const updatePhoto = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { description?: string; season?: string } }) => 
      lookbookService.updatePhoto(id, data),
    onSuccess: (data, variables) => {
      // Invalidar cache de lookbook
      cacheInvalidation.onLookbookUpdate().forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
  });

  const deletePhoto = useMutation({
    mutationFn: lookbookService.deletePhoto,
    onSuccess: (data, variables) => {
      // Invalidar cache de lookbook
      cacheInvalidation.onLookbookUpdate().forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
  });

  return {
    addPhotos,
    updatePhoto,
    deletePhoto,
  };
} 