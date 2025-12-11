import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if user has session cookie
  const sessionToken = request.cookies.get('next-auth.session-token') ||
                       request.cookies.get('__Secure-next-auth.session-token');

  // If no session token, redirect to login
  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Protected routes:
     * - / (home/create project)
     * - /projects
     * - /clients
     * - /api/* (except /api/auth and /api/share)
     *
     * Public routes:
     * - /login
     * - /share/* (public share links)
     * - /[slug] (prototype viewer - dynamic routes)
     * - /api/auth/* (NextAuth endpoints)
     * - /api/share/* (public share link API)
     */
    '/',
    '/projects/:path*',
    '/clients/:path*',
    '/api/((?!auth|share).*)',
  ],
};
