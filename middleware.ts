import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Get the session cookie
  const session = request.cookies.get('session')?.value

  // 2. Define the paths
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  const isEngineerPage = request.nextUrl.pathname.startsWith('/engineer')
  
  // Public assets (images, fonts, etc) - Do not block these
  const isPublicAsset = 
    request.nextUrl.pathname.startsWith('/_next') || 
    request.nextUrl.pathname.includes('.') // like favicon.ico, logo.png

  if (isPublicAsset) return NextResponse.next()

  // ----------------------------------------------------------------
  // SCENARIO 1: USER IS NOT LOGGED IN
  // ----------------------------------------------------------------
  if (!session) {
    // If they are strictly on the login page, let them stay
    if (isLoginPage) {
      return NextResponse.next()
    }
    // Otherwise, kick them to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ----------------------------------------------------------------
  // SCENARIO 2: USER IS LOGGED IN
  // ----------------------------------------------------------------
  const [userId, role, name] = session.split('|')

  // If they are on Login page but already logged in, redirect them to their dashboard
  if (isLoginPage) {
    if (role === 'ENGINEER') {
      return NextResponse.redirect(new URL('/engineer', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url)) // Admin goes to main dashboard
  }

  // SECURITY CHECK: PREVENT ENGINEERS FROM ACCESSING ADMIN PAGES
  // If role is ENGINEER, they can ONLY visit /engineer
  if (role === 'ENGINEER' && !isEngineerPage) {
    return NextResponse.redirect(new URL('/engineer', request.url))
  }

  // If role is ADMIN, they can go anywhere (default allow)
  return NextResponse.next()
}

// Apply this middleware to everything except API routes and static files
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}