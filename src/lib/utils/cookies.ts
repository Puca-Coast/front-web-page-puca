/**
 * cookies.ts - Utilitário para gerenciar cookies com segurança
 * 
 * Este módulo implementa funções para manipular cookies seguindo
 * as melhores práticas de segurança de 2025.
 */

import { Cookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';

interface CookieOptions {
  path?: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

// Instância do gerenciador de cookies
const cookies = new Cookies();

// Configuração padrão para cookies de autenticação
const defaultAuthOptions: CookieOptions = {
  path: '/',
  maxAge: 86400, // 1 dia em segundos
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

/**
 * Configura um cookie de autenticação
 */
export const setAuthCookie = (name: string, value: string, options: CookieOptions = {}) => {
  cookies.set(name, value, {
    ...defaultAuthOptions,
    ...options,
  });
};

/**
 * Obtém o valor de um cookie
 */
export const getCookie = (name: string): string | undefined => {
  return cookies.get(name);
};

/**
 * Remove um cookie
 */
export const removeCookie = (name: string, options: CookieOptions = {}) => {
  cookies.remove(name, {
    path: '/',
    ...options,
  });
};

/**
 * Interface para o payload do JWT
 */
interface JwtPayload {
  exp: number;
  userId: string;
  email: string;
  role: string;
}

/**
 * Verifica se um token JWT está expirado
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

/**
 * Configura cookies de autenticação
 */
export const setAuthCookies = (token: string, role: string) => {
  // Guarda o token em um cookie seguro
  setAuthCookie('token', token, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400, // 1 dia em segundos
  });
  
  // Guarda a role em um cookie separado
  setAuthCookie('role', role, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400, // 1 dia em segundos
  });
};

/**
 * Remove cookies de autenticação (logout)
 */
export const clearAuthCookies = () => {
  removeCookie('token');
  removeCookie('role');
}; 