/**
 * httpClient.ts - Cliente HTTP centralizado com interceptors
 * 
 * Este módulo implementa um cliente HTTP com tratamento adequado de tokens e erros,
 * seguindo as melhores práticas de 2025 para segurança e manutenibilidade.
 */

import { toast } from 'react-toastify';
import { getCookie } from '../../utils/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Cliente HTTP com interceptors para tokens e erros
 */
export const httpClient = {
  /**
   * Realiza uma requisição fetch com tratamento de erros e tokens
   */
  async fetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = false, ...fetchOptions } = options;
    
    // Configuração padrão
    const headers = new Headers(fetchOptions.headers || {});
    headers.set('Content-Type', 'application/json');
    
    // Adiciona token de autenticação se necessário
    if (requiresAuth) {
      const token = getCookie('token');
      if (!token) {
        // Se não há token, redireciona para login se estiver no navegador
        if (typeof window !== 'undefined') {
          toast.error('Sua sessão expirou. Por favor, faça login novamente.');
          window.location.href = '/login';
        }
        throw new Error('Autenticação necessária');
      }
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers
      });
      
      // Tratamento de erros HTTP
      if (!response.ok) {
        // Token expirado ou inválido
        if (response.status === 401 && requiresAuth) {
          if (typeof window !== 'undefined') {
            toast.error('Sua sessão expirou. Por favor, faça login novamente.');
            window.location.href = '/login';
          }
          throw new Error('Sessão expirada');
        }
        
        // Outros erros HTTP
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(errorData.message || `Erro ${response.status}`);
      }
      
      // Retorna dados da resposta
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  },
  
  /**
   * GET request
   */
  async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'GET', requiresAuth });
  },
  
  /**
   * POST request
   */
  async post<T>(endpoint: string, data: any, requiresAuth = false): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST', 
      body: JSON.stringify(data),
      requiresAuth
    });
  },
  
  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: any, requiresAuth = false): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'PUT', 
      body: JSON.stringify(data),
      requiresAuth
    });
  },
  
  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'DELETE',
      requiresAuth
    });
  }
}; 