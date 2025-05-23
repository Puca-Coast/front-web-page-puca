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

  // Obtém o token do cookie ou do localStorage
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.split(' ')[1];
  
  if (!token) {
    // Redireciona para login se não houver token
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    // Verifica se o token está expirado
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      // Token expirado, redireciona para login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Verifica se a rota requer privilégios de admin
    if (isAdminRoute && decoded.role !== 'admin') {
      // Usuário não é admin, redireciona para o perfil
      return NextResponse.redirect(new URL('/profile', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    // Erro ao decodificar token, redireciona para login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configuração para aplicar o middleware apenas em rotas específicas
export const config = {
  matcher: [
    '/profile/:path*',
    '/admin/:path*',
  ],
}; 