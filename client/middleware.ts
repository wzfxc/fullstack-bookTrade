import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_TOKEN_COOKIE_NAME } from '@/lib/auth-token';
import { isTokenExpired } from '@/lib/jwt';

const AUTH_PAGE_PATHS = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;
  const isAuthenticated = token !== undefined && !isTokenExpired(token);
  const isAuthPage = AUTH_PAGE_PATHS.includes(request.nextUrl.pathname);

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/books', request.url));
  }

  if (!isAuthenticated && !isAuthPage) {
    const loginRedirect = NextResponse.redirect(new URL('/login', request.url));

    if (token !== undefined) {
      loginRedirect.cookies.delete(AUTH_TOKEN_COOKIE_NAME);
    }

    return loginRedirect;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/me/:path*', '/admin/:path*', '/login', '/register'],
};

