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
  imageUrl: string; // ID/URL principal
  hoverImageUrl: string; // ID/URL hover
  galleryImageUrls?: string[]; // Imagens adicionais
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
   * URL para imagem de produto com fallbacks e debug
   */
  getProductImageUrl(imageId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

    // Se a string já for uma URL completa (Cloudinary, S3 etc.) basta retornar
    if (imageId?.startsWith('http')) {
      return imageId;
    }

    // Validação do imageId
    if (!imageId || imageId === 'undefined' || imageId === 'null') {
      return '/assets/placeholder-product.svg';
    }

    return `${baseUrl}/api/products/image/${imageId}`;
  },

  /**
   * Verificar se imagem existe (para fallback)
   */
  async checkImageExists(imageUrl: string): Promise<boolean> {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.warn('Erro ao verificar imagem:', error);
      return false;
    }
  },

  /**
   * Obter URL de fallback para imagem
   */
  getFallbackImageUrl(): string {
    return '/assets/placeholder-product.svg';
  },

  /**
   * Cria um novo produto (requer permissão de administrador)
   */
  async createProduct(formData: FormData): Promise<ProductResponse> {
    try {
      return await httpClient.upload<ProductResponse>('/api/products', formData);
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
      return await httpClient.upload<ProductResponse>(`/api/products/${id}`, formData, { method: 'PUT' });
    } catch (error) {
      console.error(`Erro ao atualizar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletar produto (admin)
   */
  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await httpClient.delete<{ success: boolean; message: string }>(`/api/products/${id}`);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  }
}; 