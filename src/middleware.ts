import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/auth', '/api/auth/login', '/api/auth/signup'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isAPI = pathname.startsWith('/api');

  if (!token && !isPublic && !isAPI) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  const knownRoutes = ['/', '/dashboard', '/subscription', '/auth'];
  const isKnownRoute = knownRoutes.includes(pathname);

  if (token && !isAPI && !isKnownRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/((?!_next|static|favicon.ico).*)'],
};
