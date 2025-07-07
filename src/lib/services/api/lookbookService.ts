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
   * Adiciona fotos ao lookbook (admin)
   */
  async addPhotos(formData: FormData): Promise<{ success: boolean; data: LookbookPhoto[] }> {
    try {
      return await httpClient.upload<{ success: boolean; data: LookbookPhoto[] }>('/api/lookbook/photos', formData);
    } catch (error) {
      console.error('Erro ao adicionar fotos ao lookbook:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma foto do lookbook (admin)
   */
  async updatePhoto(
    id: string,
    data: { description?: string; launch?: string }
  ): Promise<LookbookPhotoResponse> {
    try {
      return await httpClient.put<LookbookPhotoResponse>(`/api/lookbook/photos/${id}`, data);
    } catch (error) {
      console.error(`Erro ao atualizar foto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exclui uma foto do lookbook (admin)
   */
  async deletePhoto(id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await httpClient.delete<{ success: boolean; message: string }>(`/api/lookbook/photos/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir foto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Atualizar foto do lookbook (admin)
   */
  async updateLookbookPhoto(id: string, data: Partial<LookbookPhoto>): Promise<LookbookPhotoResponse> {
    try {
      return await httpClient.put<LookbookPhotoResponse>(`/api/lookbook/photos/${id}`, data);
    } catch (error) {
      console.error('Erro ao atualizar foto do lookbook:', error);
      throw error;
    }
  },

  /**
   * Deletar foto do lookbook (admin)
   */
  async deleteLookbookPhoto(id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await httpClient.delete<{ success: boolean; message: string }>(`/api/lookbook/photos/${id}`);
    } catch (error) {
      console.error('Erro ao deletar foto do lookbook:', error);
      throw error;
    }
  }
}; 