import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Rotas que requerem autenticação
const protectedRoutes = [
  '/profile',
  '/admin',
  '/checkout',
];

// Rotas que requerem privilégios de administrador
const adminRoutes = [
  '/admin'
];

// Interface para o payload do JWT
interface JwtPayload {
  exp: number;
  userId: string;
  email: string;
  role: string;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verifica se a rota requer autenticação
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Obtém o token do cookie com o nome correto (auth_token)
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.split(' ')[1];
  
  console.log('🔍 Middleware - Verificando rota:', pathname);
  console.log('🔍 Middleware - Token encontrado:', !!token);
  
  // Se não há token, permite o acesso e deixa o AuthContext fazer a verificação
  if (!token) {
    console.log('⚠️ Middleware - Token não encontrado, permitindo acesso para verificação no cliente');
    return NextResponse.next();
  }
  
  try {
    // Verifica se o token está expirado
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    
    console.log('🔍 Middleware - Token decodificado:', { 
      userId: decoded.userId, 
      role: decoded.role, 
      exp: decoded.exp,
      currentTime 
    });
    
    if (decoded.exp < currentTime) {
      console.log('❌ Middleware - Token expirado, permitindo acesso para verificação no cliente');
      // Token expirado, mas permite o acesso para o AuthContext fazer a verificação
      return NextResponse.next();
    }
    
    // Verifica se a rota requer privilégios de admin
    if (isAdminRoute && decoded.role !== 'admin') {
      console.log('❌ Middleware - Usuário não é admin, redirecionando para home');
      // Usuário não é admin, redireciona para o perfil
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    console.log('✅ Middleware - Acesso autorizado');
    return NextResponse.next();
  } catch (error) {
    console.log('❌ Middleware - Erro ao decodificar token, permitindo acesso para verificação no cliente');
    // Erro ao decodificar token, mas permite o acesso para o AuthContext fazer a verificação
    return NextResponse.next();
  }
}

// Configuração para aplicar o middleware apenas em rotas específicas
export const config = {
  matcher: [
    '/profile/:path*',
    '/admin/:path*',
  ],
}; 