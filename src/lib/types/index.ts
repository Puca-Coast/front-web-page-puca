/**
 * Definições de tipos centralizadas
 * 
 * Este arquivo centraliza as definições de tipos comuns utilizadas em toda a aplicação,
 * facilitando a manutenção e evitando duplicação.
 */

// Tipos de usuário
export interface User {
  _id: string;
  email: string;
  role: string;
  location?: string;
}

// Tipos de produto
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  hoverImageUrl: string;
  stockBySize: StockBySize[];
}

export interface StockBySize {
  size: string;
  stock: number;
}

// Tipos de carrinho
export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size: string;
}

// Tipos de lookbook
export interface LookbookPhoto {
  _id: string;
  url: string;
  publicId: string;
  description: string;
  launch: string;
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Tipos de autenticação
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  role?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
}

// Tipos de JWT
export interface JwtPayload {
  exp: number;
  userId: string;
  email: string;
  role: string;
}

// Tipos de opções de cookie
export interface CookieOptions {
  path?: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
} 