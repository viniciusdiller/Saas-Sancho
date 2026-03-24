import { NextRequest, NextResponse } from 'next/server';
import { authConfig, verifySessionToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const token = request.cookies.get(authConfig.cookieName)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (isDashboardRoute && !session) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (request.nextUrl.pathname === '/' && session) {
    return NextResponse.redirect(new URL('/dashboard/calendar', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
