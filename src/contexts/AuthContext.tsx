"use client";

import React from 'react';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../lib/services/api/authService';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { getCookie, setAuthCookies, clearAuthCookies, isTokenExpired } from '../lib/utils/cookies';

// Interface do usuário no contexto
interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  isAdmin: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  authLoading: boolean; // Adicionado para compatibilidade
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = getCookie('auth_token');
      
      if (!token) {

        clearAuthCookies();
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      if (isTokenExpired(token)) {

        clearAuthCookies();
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      const response = await authService.getProfile();
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {

        clearAuthCookies();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      clearAuthCookies();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.token && response.user) {
        // Configurar cookies primeiro
        setAuthCookies(response.token, response.user.isAdmin ? 'admin' : 'user');
        
        // Atualizar estado
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Mostrar toast de sucesso
        toast.success('Login realizado com sucesso!');
        
        // Redirecionar para home com skipIntro
        setTimeout(() => {
          router.push('/?skipIntro=true');
        }, 1000);
        
        return true;
      } else {
        toast.error(response.message || 'Erro ao fazer login');
        return false;
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(error.message || 'Erro ao fazer login');
      return false;
    }
  };

  const logout = () => {
    clearAuthCookies();
    setUser(null);
    setIsAuthenticated(false);
    toast.info('Logout realizado com sucesso');
    router.push('/');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin: user?.isAdmin || false,
    isLoading,
    authLoading: isLoading, // Alias para compatibilidade
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// HOC para proteger rotas (client-side)
export const withAuth = (Component: any) => {
  return function AuthenticatedComponent(props: any) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      if (!isLoading && !user) {
        router.push('/login');
      }
    }, [user, isLoading, router]);
    
    if (isLoading) {
      return <div>Verificando autenticação...</div>;
    }
    
    return user ? <Component {...props} /> : null;
  };
};

// HOC para proteger rotas de administrador (client-side)
export const withAdminAuth = (Component: any) => {
  return function AdminComponent(props: any) {
    const { user, isAdmin, isLoading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          router.push('/login');
        } else if (!isAdmin) {
          toast.error('Acesso não autorizado');
          router.push('/profile');
        }
      }
    }, [user, isAdmin, isLoading, router]);
    
    if (isLoading) {
      return <div>Verificando autenticação...</div>;
    }
    
    return user && isAdmin ? <Component {...props} /> : null;
  };
}; 