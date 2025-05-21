/**
 * authService.ts - Serviço de autenticação
 * 
 * Este módulo implementa funções para autenticação de usuários,
 * seguindo as melhores práticas de 2025.
 */

import { httpClient } from './httpClient';
import { clearAuthCookies } from '../../utils/cookies';

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
}

export interface User {
  email: string;
  role: string;
  _id: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  role?: string;
}

export interface ProfileResponse {
  success: boolean;
  data: User;
}

/**
 * Serviço de autenticação
 */
export const authService = {
  /**
   * Realiza o login do usuário
   */
  async login(params: LoginParams): Promise<AuthResponse> {
    try {
      return await httpClient.post<AuthResponse>('/api/auth/login', params);
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  },

  /**
   * Registra um novo usuário
   */
  async register(params: RegisterParams): Promise<AuthResponse> {
    try {
      return await httpClient.post<AuthResponse>('/api/auth/register', params);
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  },

  /**
   * Obtém o perfil do usuário logado
   */
  async getProfile(): Promise<ProfileResponse> {
    try {
      return await httpClient.get<ProfileResponse>('/api/auth/profile', true);
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      throw error;
    }
  },

  /**
   * Verifica se o usuário tem acesso de administrador
   */
  async checkAdminAccess(): Promise<AuthResponse> {
    try {
      return await httpClient.get<AuthResponse>('/api/auth/admin', true);
    } catch (error) {
      console.error('Erro ao verificar acesso admin:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Acesso negado' };
    }
  },

  /**
   * Realiza o logout do usuário
   */
  logout(): void {
    clearAuthCookies();
  }
}; 