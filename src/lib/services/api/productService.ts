/**
 * productService.ts - Serviço de produtos
 * 
 * Este módulo implementa funções para interagir com a API de produtos,
 * seguindo as melhores práticas de 2025.
 */

import { httpClient } from './httpClient';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  hoverImageUrl: string;
  stockBySize: { size: string; stock: number }[];
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface ProductSearchResponse {
  success: boolean;
  data: Product[];
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stockBySize: string; // JSON string
  image?: File;
  hoverImage?: File;
}

/**
 * Serviço de produtos
 */
export const productService = {
  /**
   * Obtém todos os produtos com paginação
   */
  async getProducts(page = 1, limit = 10): Promise<ProductsResponse> {
    try {
      return await httpClient.get<ProductsResponse>(`/api/products?page=${page}&limit=${limit}`);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  /**
   * Obtém um produto por ID
   */
  async getProductById(id: string): Promise<ProductResponse> {
    try {
      return await httpClient.get<ProductResponse>(`/api/products/${id}`);
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca produtos por nome
   */
  async searchProductsByName(query: string): Promise<ProductSearchResponse> {
    try {
      return await httpClient.get<ProductSearchResponse>(`/api/products/search/name?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Erro ao buscar produtos por nome:', error);
      throw error;
    }
  },

  /**
   * URL para imagem de produto
   */
  getProductImageUrl(imageId: string): string {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/products/image/${imageId}`;
  },

  /**
   * Cria um novo produto (requer permissão de administrador)
   */
  async createProduct(formData: FormData): Promise<ProductResponse> {
    try {
      return await httpClient.fetch<ProductResponse>('/api/products', {
        method: 'POST',
        body: formData,
        requiresAuth: true,
        // Não incluir Content-Type para que o navegador defina o boundary correto para multipart/form-data
        headers: {}
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  /**
   * Atualiza um produto existente (requer permissão de administrador)
   */
  async updateProduct(id: string, formData: FormData): Promise<ProductResponse> {
    try {
      return await httpClient.fetch<ProductResponse>(`/api/products/${id}`, {
        method: 'PUT',
        body: formData,
        requiresAuth: true,
        // Não incluir Content-Type para que o navegador defina o boundary correto para multipart/form-data
        headers: {}
      });
    } catch (error) {
      console.error(`Erro ao atualizar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exclui um produto (requer permissão de administrador)
   */
  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await httpClient.delete<{ success: boolean; message: string }>(`/api/products/${id}`, true);
    } catch (error) {
      console.error(`Erro ao excluir produto ${id}:`, error);
      throw error;
    }
  }
}; 