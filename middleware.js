import { NextResponse } from 'next/server'
 
export function middleware(request) {
  const path = request.nextUrl.pathname
  
  // Define paths that are protected
  const isProtectedPath = path.startsWith('/admin') && path !== '/admin/login'
  
  if (isProtectedPath) {
    const token = request.cookies.get('admin_authenticated')
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}
 
export const config = {
  matcher: '/admin/:path*',
}
