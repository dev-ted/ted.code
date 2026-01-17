import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to login page
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  const authCookie = request.cookies.get('admin-auth')
  
  if (pathname.startsWith('/admin')) {
    if (!authCookie || authCookie.value !== 'authenticated') {
      // Redirect to login page
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
