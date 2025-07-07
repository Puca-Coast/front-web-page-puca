/**
 * authService.ts - Serviço de autenticação
 * 
 * Este módulo implementa funções para autenticação de usuários,
 * seguindo as melhores práticas de 2025.
 */

import { httpClient } from './httpClient';

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    phone: string;
    isAdmin: boolean;
    createdAt: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    phone: string;
    isAdmin: boolean;
    createdAt: string;
  };
  message?: string;
}

/**
 * Serviço de autenticação para gerenciar login, cadastro e perfil
 */
export const authService = {
  /**
   * Realizar login do usuário
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      return await httpClient.post<AuthResponse>('/api/auth/login', data);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },

  /**
   * Realizar cadastro do usuário
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      return await httpClient.post<AuthResponse>('/api/auth/signup', data);
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error);
      throw error;
    }
  },

  /**
   * Fazer logout do usuário
   */
  async logout(): Promise<void> {
    try {
      await httpClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Não propagar o erro, pois o logout sempre deve funcionar localmente
    }
  },

  /**
   * Obter perfil do usuário autenticado
   */
  async getProfile(): Promise<ProfileResponse> {
    try {
      return await httpClient.get<ProfileResponse>('/api/auth/profile');
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      throw error;
    }
  },

  /**
   * Atualizar perfil do usuário
   */
  async updateProfile(data: Partial<SignupData>): Promise<ProfileResponse> {
    try {
      return await httpClient.put<ProfileResponse>('/api/auth/profile', data);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  },

  /**
   * Verificar se o usuário está autenticado
   */
  async checkAuth(): Promise<boolean> {
    try {
      const response = await this.getProfile();
      return response.success;
    } catch (error) {
      return false;
    }
  },

  /**
   * Solicitar redefinição de senha
   */
  async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      return await httpClient.post<AuthResponse>('/api/auth/reset-password', { email });
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      throw error;
    }
  },

  /**
   * Confirmar redefinição de senha
   */
  async confirmPasswordReset(token: string, password: string): Promise<AuthResponse> {
    try {
      return await httpClient.post<AuthResponse>('/api/auth/confirm-reset', { token, password });
    } catch (error) {
      console.error('Erro ao confirmar redefinição de senha:', error);
      throw error;
    }
  },
}; 