/**
 * Utilitários para fazer requisições à API
 */

// Obtém a URL base da API a partir das variáveis de ambiente
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://puca-api.vercel.app';

// Headers padrão para as requisições
const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
};

// Interface para as opções de requisição
interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: HeadersInit;
  body?: any;
}

/**
 * Função para fazer requisições à API
 * 
 * @param endpoint - O endpoint da API (sem a URL base)
 * @param options - Opções para a requisição
 * @returns Uma Promise com a resposta da requisição
 */
export async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const { method = 'GET', headers = {}, body } = options;
  
  const requestOptions: RequestInit = {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    credentials: 'include',
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error(`Erro ao acessar a API (${url}):`, error);
    throw error;
  }
}

/**
 * Função para fazer uma requisição GET
 */
export function get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET', headers });
}

/**
 * Função para fazer uma requisição POST
 */
export function post<T>(endpoint: string, body?: any, headers?: HeadersInit): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'POST', body, headers });
}

/**
 * Função para fazer uma requisição PUT
 */
export function put<T>(endpoint: string, body?: any, headers?: HeadersInit): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'PUT', body, headers });
}

/**
 * Função para fazer uma requisição DELETE
 */
export function del<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE', headers });
} 