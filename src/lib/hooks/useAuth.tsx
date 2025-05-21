"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User } from '../services/api/authService';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { getCookie, setAuthCookies, clearAuthCookies, isTokenExpired } from '../utils/cookies';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface JwtPayload {
  exp: number;
  userId: string;
  email: string;
  role: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verifica token ao carregar o componente
  useEffect(() => {
    const verifyToken = async () => {
      await checkAuth();
      setIsLoading(false);
    };
    verifyToken();
  }, []);

  // Verifica a autenticação do usuário
  const checkAuth = async (): Promise<boolean> => {
    const token = getCookie('token');
    
    if (!token || isTokenExpired(token)) {
      setUser(null);
      return false;
    }

    try {
      const response = await authService.getProfile();
      if (response.success) {
        setUser(response.data);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch {
      setUser(null);
      return false;
    }
  };

  // Login de usuário
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.token) {
        // Armazena tokens em cookies seguros em vez de localStorage
        setAuthCookies(response.token, response.role || 'user');
        
        await checkAuth();
        return true;
      } else {
        toast.error(response.message || 'Erro ao fazer login.');
        return false;
      }
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.');
      return false;
    }
  };

  // Registro de usuário
  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.register({ email, password });
      
      if (response.success) {
        toast.success('Registro realizado com sucesso!');
        return true;
      } else {
        toast.error(response.message || 'Erro ao realizar cadastro.');
        return false;
      }
    } catch (error) {
      toast.error('Erro ao realizar cadastro. Tente novamente.');
      return false;
    }
  };

  // Logout
  const logout = () => {
    // Remove tokens dos cookies
    clearAuthCookies();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        register,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC para proteger rotas (client-side)
export const withAuth = (Component: React.ComponentType) => {
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
export const withAdminAuth = (Component: React.ComponentType) => {
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