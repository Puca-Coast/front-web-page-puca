/**
 * Configurações de ambiente da aplicação
 * 
 * Este arquivo centraliza todas as configurações relacionadas ao ambiente
 * da aplicação, facilitando a mudança entre ambientes de desenvolvimento,
 * teste e produção.
 */

// API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Autenticação
export const AUTH_TOKEN_EXPIRY = 86400; // 1 dia em segundos

// Configurações de cookies
export const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/'
};

// Configurações de rota
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  ADMIN: '/admin',
  SHOP: '/shop',
  PRODUCT: '/product',
  LOOKBOOK: '/lookbook'
};

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10
}; 