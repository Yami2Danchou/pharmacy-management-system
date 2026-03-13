import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Define public paths
  const isPublicPath = path === '/login';
  
  // Get token from cookies - in middleware we still use request.cookies directly
  const token = request.cookies.get('token')?.value;
  
  // If it's a public path and user is logged in, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If it's a private path and user is not logged in, redirect to login
  if (!isPublicPath && !token && path !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};