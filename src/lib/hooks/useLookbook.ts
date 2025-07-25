import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lookbookService } from '@/lib/services/api/lookbookService';

// Query keys para cache
export const lookbookKeys = {
  all: ['lookbook'] as const,
  lists: () => [...lookbookKeys.all, 'list'] as const,
  list: (filters: any) => [...lookbookKeys.lists(), filters] as const,
  details: () => [...lookbookKeys.all, 'detail'] as const,
  detail: (id: string) => [...lookbookKeys.details(), id] as const,
};

// Hook para buscar fotos do lookbook com cache
export function useLookbookPhotos(page = 1, limit = 10, launch?: string) {
  return useQuery({
    queryKey: lookbookKeys.list({ page, limit, launch }),
    queryFn: () => lookbookService.getPhotos(page, limit, launch),
    staleTime: 30 * 60 * 1000, // 30 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Hook para buscar todas as fotos do lookbook (sem paginação)
export function useAllLookbookPhotos(launch?: string) {
  return useQuery({
    queryKey: lookbookKeys.list({ all: true, launch }),
    queryFn: () => lookbookService.getPhotos(1, 1000, launch), // Buscar todas com limite alto
    staleTime: 30 * 60 * 1000, // 30 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Hook para mutations (criar, atualizar, deletar fotos do lookbook)
export function useLookbookMutations() {
  const queryClient = useQueryClient();

  const addPhotos = useMutation({
    mutationFn: lookbookService.addPhotos,
    onSuccess: () => {
      // Invalidar cache de lookbook
      queryClient.invalidateQueries({ queryKey: lookbookKeys.lists() });
    },
  });

  const updatePhoto = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { description?: string; launch?: string } }) => 
      lookbookService.updatePhoto(id, data),
    onSuccess: (data, variables) => {
      // Invalidar cache de listas
      queryClient.invalidateQueries({ queryKey: lookbookKeys.lists() });
    },
  });

  const deletePhoto = useMutation({
    mutationFn: lookbookService.deletePhoto,
    onSuccess: (data, variables) => {
      // Invalidar cache de listas
      queryClient.invalidateQueries({ queryKey: lookbookKeys.lists() });
    },
  });

  return {
    addPhotos,
    updatePhoto,
    deletePhoto,
  };
} 