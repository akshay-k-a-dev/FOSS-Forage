import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of known routes in your application
const KNOWN_ROUTES = [
  '/',
  '/about',
  '/login',
  '/register',
  '/forum',
  '/forgot-password',
  // Add other valid routes here
]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the path starts with any known route
  const isKnownRoute = KNOWN_ROUTES.some(route => 
    path === route || path.startsWith(`${route}/`)
  )

  // Check if the path is requesting an API route or static file
  const isApiRoute = path.startsWith('/api/')
  const isStaticFile = path.includes('.')

  // If it's not a known route, API route, or static file, redirect to 404
  if (!isKnownRoute && !isApiRoute && !isStaticFile) {
    return NextResponse.redirect(new URL('/404', request.url))
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
