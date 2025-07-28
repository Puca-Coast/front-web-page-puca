/**
 * httpClient.ts - Cliente HTTP centralizado com interceptors
 * 
 * Este módulo implementa um cliente HTTP com tratamento adequado de tokens e erros,
 * seguindo as melhores práticas de 2025 para segurança e manutenibilidade.
 */

import { toast } from 'react-toastify';
import { getCookie, clearAuthCookies } from '../../utils/cookies';


/**
 * HTTP Client para comunicação com API
 */

// Configuração da API
const getApiBaseUrl = (): string => {
  // Usar a variável de ambiente ou fallback para a URL da API local
  const url = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  return url;
};

const API_BASE_URL = getApiBaseUrl();

// Configuração para retry automático
const RETRY_ATTEMPTS = 1; // Reduzido de 3 para 1 para evitar múltiplas tentativas
const RETRY_DELAY = 1000; // 1 segundo

// Função para delay entre tentativas
const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Função para fazer retry de requisições
const withRetry = async <T>(
  fn: () => Promise<T>, 
  attempts: number = RETRY_ATTEMPTS,
  delayMs: number = RETRY_DELAY
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (attempts > 1) {
      await delay(delayMs);
      return withRetry(fn, attempts - 1, delayMs * 1.5); // Backoff exponencial
    }
    throw error;
  }
};

// Configuração padrão para requisições
const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  mode: 'cors',
};

/**
 * Interceptor para adicionar token de autenticação e credenciais quando necessário
 */
const addAuthHeader = (options: RequestInit): RequestInit => {
  const token = getCookie('auth_token');
  
  if (token) {
    return {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    };
  }
  
  return options;
};

/**
 * Interceptor para tratar erros HTTP
 */
const handleHttpError = async (response: Response): Promise<Response> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Tratamento específico para diferentes códigos de erro
    switch (response.status) {
      case 401:
        // Não redirecionar automaticamente - deixar o componente decidir
        break;
      case 403:
        toast.error('Acesso negado.');
        break;
      case 404:
        toast.error('Recurso não encontrado.');
        break;
      case 500:
        toast.error('Erro interno do servidor. Tente novamente.');
        break;
      default:
        toast.error(errorData.message || 'Erro na requisição');
    }
    
    throw new Error(`HTTP Error: ${response.status} - ${errorData.message || response.statusText}`);
  }
  
  return response;
};

/**
 * Cliente HTTP principal
 */
export const httpClient = {
  /**
   * Método GET
   */
  get: async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    return withRetry(async () => {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        method: 'GET',
        ...addAuthHeader({ ...defaultOptions, ...options }),
      });
      
      await handleHttpError(response);
      return response.json();
    });
  },

  /**
   * Método POST
   */
  post: async <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    return withRetry(async () => {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
        ...addAuthHeader({ ...defaultOptions, ...options }),
      });
      
      await handleHttpError(response);
      return response.json();
    });
  },

  /**
   * Método PUT
   */
  put: async <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    return withRetry(async () => {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
        ...addAuthHeader({ ...defaultOptions, ...options }),
      });
      
      await handleHttpError(response);
      return response.json();
    });
  },

  /**
   * Método DELETE
   */
  delete: async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    return withRetry(async () => {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        method: 'DELETE',
        ...addAuthHeader({ ...defaultOptions, ...options }),
      });
      
      await handleHttpError(response);
      return response.json();
    });
  },

  /**
   * Método para upload de arquivos
   */
  upload: async <T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    return withRetry(async () => {
      const authOptions = addAuthHeader({ ...options, mode: 'cors' });
      const response = await fetch(url, {
        ...authOptions,
        method: 'POST',
        body: formData,
        headers: {
          // Não definir Content-Type para FormData (o navegador define automaticamente)
          ...authOptions?.headers,
        },
      });
      
      await handleHttpError(response);
      return response.json();
    });
  },

  /**
   * Método para requisições customizadas
   */
  request: async <T>(endpoint: string, options: RequestInit): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    return withRetry(async () => {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        ...addAuthHeader({ ...defaultOptions, ...options }),
      });
      
      await handleHttpError(response);
      return response.json();
    });
  },

  /**
   * Método para testar conectividade
   */
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        mode: 'cors',
      });
      
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },
};

export default httpClient; 