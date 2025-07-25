import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/lib/services/api/productService';

// Query keys para cache
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: any) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Hook para buscar produtos com cache
export function useProducts(page = 1, limit = 20) {
  return useQuery({
    queryKey: productKeys.list({ page, limit }),
    queryFn: () => productService.getProducts(page, limit),
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 2 * 60 * 60 * 1000, // 2 horas
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Hook para buscar produto específico
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
  });
}

// Hook para buscar produtos por nome
export function useProductsBySearch(searchTerm: string) {
  return useQuery({
    queryKey: productKeys.list({ search: searchTerm }),
    queryFn: () => productService.searchProductsByName(searchTerm),
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 15 * 60 * 1000, // 15 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
}

// Hook para mutations (criar, atualizar, deletar produtos)
export function useProductMutations() {
  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      // Invalidar cache de produtos
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => 
      productService.updateProduct(id, data),
    onSuccess: (data, variables) => {
      // Atualizar cache específico do produto
      queryClient.setQueryData(productKeys.detail(variables.id), data);
      // Invalidar cache de listas
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: (data, variables) => {
      // Remover do cache
      queryClient.removeQueries({ queryKey: productKeys.detail(variables) });
      // Invalidar cache de listas
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });

  return {
    createProduct,
    updateProduct,
    deleteProduct,
  };
} 