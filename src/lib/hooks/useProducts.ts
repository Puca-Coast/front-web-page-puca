import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { productService } from '@/lib/services/api/productService';
import { queryKeys, staleTime, cacheTime, cacheInvalidation } from '../queryKeys';

// Hook para buscar produtos com cache
export function useProducts(page = 1, limit = 20) {
  return useQuery({
    queryKey: queryKeys.products.list({ page, limit }),
    queryFn: () => productService.getProducts(page, limit),
    staleTime: staleTime.PRODUCTS,
    gcTime: cacheTime.GC_TIME,
  });
}

// Hook para buscar produtos com infinite scrolling
export function useInfiniteProducts(limit = 20) {
  return useInfiniteQuery({
    queryKey: queryKeys.products.lists(),
    queryFn: ({ pageParam = 1 }) => productService.getProducts(pageParam, limit),
    staleTime: staleTime.PRODUCTS,
    gcTime: cacheTime.GC_TIME,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.success || !lastPage.pagination) return undefined;
      
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

// Hook para buscar produto específico
export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    staleTime: staleTime.PRODUCTS,
    gcTime: cacheTime.GC_TIME,
  });
}

// Hook para buscar produtos por nome
export function useProductsBySearch(searchTerm: string) {
  return useQuery({
    queryKey: queryKeys.products.search(searchTerm),
    queryFn: () => productService.searchProductsByName(searchTerm),
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: staleTime.SEARCH,
    gcTime: cacheTime.GC_TIME,
  });
}

// Hook para mutations (criar, atualizar, deletar produtos)
export function useProductMutations() {
  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      // Invalidar cache de produtos usando invalidation helper
      cacheInvalidation.onProductUpdate('new').forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => 
      productService.updateProduct(id, data),
    onSuccess: (data, variables) => {
      // Atualizar cache específico do produto
      queryClient.setQueryData(queryKeys.products.detail(variables.id), data);
      
      // Invalidar caches relacionados
      cacheInvalidation.onProductUpdate(variables.id).forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: (data, variables) => {
      // Remover do cache
      queryClient.removeQueries({ queryKey: queryKeys.products.detail(variables) });
      
      // Invalidar caches relacionados
      cacheInvalidation.onProductUpdate(variables).forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
  });

  return {
    createProduct,
    updateProduct,
    deleteProduct,
  };
} 