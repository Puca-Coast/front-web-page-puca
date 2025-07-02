/**
 * httpClient.ts - Cliente HTTP centralizado com interceptors
 * 
 * Este módulo implementa um cliente HTTP com tratamento adequado de tokens e erros,
 * seguindo as melhores práticas de 2025 para segurança e manutenibilidade.
 */

import { toast } from 'react-toastify';
import { getCookie } from '../../utils/cookies';

/**
 * HTTP Client para comunicação com API
 */

// Configuração da API
const getApiBaseUrl = (): string => {
  // Em ambiente de desenvolvimento local
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  
  // Em produção
  return 'https://puca-api.vercel.app';
};

const API_BASE_URL = getApiBaseUrl();

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
      
      // Log da resposta para debug
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));
      
      // Verifica se a resposta tem conteúdo
      const contentType = response.headers.get('content-type');
      const hasContent = contentType && contentType.includes('application/json');
      
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
        
        // Outros erros HTTP - tenta parsear JSON, senão usa texto
        let errorMessage = `Erro ${response.status}`;
        if (hasContent) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            // Se não conseguir parsear JSON, pega o texto
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }
      
      // Retorna dados da resposta se for JSON, senão retorna texto
      if (hasContent) {
      const data = await response.json();
      return data;
      } else {
        // Se não for JSON, retorna o texto como resposta
        const text = await response.text();
        return text as unknown as T;
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  },
  
  /**
   * GET request
   */
  async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.fetch(endpoint, { method: 'GET', requiresAuth });
  },
  
  /**
   * POST request
   */
  async post<T>(endpoint: string, body: any, requiresAuth = false): Promise<T> {
    return this.fetch(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(body), 
      requiresAuth
    });
  },
  
  /**
   * PUT request
   */
  async put<T>(endpoint: string, body: any, requiresAuth = false): Promise<T> {
    return this.fetch(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(body), 
      requiresAuth
    });
  },
  
  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.fetch(endpoint, { 
      method: 'DELETE',
      requiresAuth
    });
  }
}; 