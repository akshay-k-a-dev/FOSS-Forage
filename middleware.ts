import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// List of protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/admin',
  '/forum/new'
]

// List of admin-only routes
const ADMIN_ROUTES = [
  '/admin'
]

// List of routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = [
  '/login',
  '/register',
  '/signup'
]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  // Check if user is authenticated
  let user = null
  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    } catch (error) {
      // Invalid token
      user = null
    }
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.some(route => path.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Check if route requires authentication
  if (PROTECTED_ROUTES.some(route => path.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check admin routes
    if (ADMIN_ROUTES.some(route => path.startsWith(route))) {
      if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}