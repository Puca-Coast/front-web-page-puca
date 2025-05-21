/**
 * lookbookService.ts - Serviço de lookbook
 * 
 * Este módulo implementa funções para interagir com a API de lookbook,
 * seguindo as melhores práticas de 2025.
 */

import { httpClient } from './httpClient';

export interface LookbookPhoto {
  _id: string;
  url: string;
  publicId: string;
  description: string;
  launch: string;
}

export interface LookbookPhotosResponse {
  success: boolean;
  data: LookbookPhoto[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface LookbookPhotoResponse {
  success: boolean;
  data: LookbookPhoto;
}

/**
 * Serviço de lookbook
 */
export const lookbookService = {
  /**
   * Obtém fotos do lookbook com paginação
   */
  async getPhotos(page = 1, limit = 10, launch?: string): Promise<LookbookPhotosResponse> {
    try {
      let endpoint = `/api/lookbook/photos?page=${page}&limit=${limit}`;
      if (launch) {
        endpoint += `&launch=${encodeURIComponent(launch)}`;
      }
      return await httpClient.get<LookbookPhotosResponse>(endpoint);
    } catch (error) {
      console.error('Erro ao buscar fotos do lookbook:', error);
      throw error;
    }
  },

  /**
   * Adiciona fotos ao lookbook (requer permissão de administrador)
   */
  async addPhotos(formData: FormData): Promise<{ success: boolean; data: LookbookPhoto[] }> {
    try {
      return await httpClient.fetch<{ success: boolean; data: LookbookPhoto[] }>('/api/lookbook/photos', {
        method: 'POST',
        body: formData,
        requiresAuth: true,
        // Não incluir Content-Type para que o navegador defina o boundary correto para multipart/form-data
        headers: {}
      });
    } catch (error) {
      console.error('Erro ao adicionar fotos ao lookbook:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma foto do lookbook (requer permissão de administrador)
   */
  async updatePhoto(
    id: string,
    data: { description?: string; launch?: string }
  ): Promise<LookbookPhotoResponse> {
    try {
      return await httpClient.put<LookbookPhotoResponse>(`/api/lookbook/photos/${id}`, data, true);
    } catch (error) {
      console.error(`Erro ao atualizar foto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exclui uma foto do lookbook (requer permissão de administrador)
   */
  async deletePhoto(id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await httpClient.delete<{ success: boolean; message: string }>(`/api/lookbook/photos/${id}`, true);
    } catch (error) {
      console.error(`Erro ao excluir foto ${id}:`, error);
      throw error;
    }
  }
}; 