// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Proteger rutas que comienzan con /dashboard
  if (pathname.startsWith('/dashboard')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      // Redirigir a login con callback
      const url = req.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    const role = typeof token.role === 'string' ? token.role.toLowerCase() : '';
    if (!['admin', 'corredor'].includes(role)) {
      return new NextResponse('Acceso denegado', { status: 403 });
    }
  }
  return NextResponse.next();
}

// No olvides exportar matcher si quieres limitar middleware solo a `/dashboard`
// Pero aquí filtramos internamente.
