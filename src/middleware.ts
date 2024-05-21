import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const dashboardPathRegex = new RegExp('^\/dashboard');

  if (dashboardPathRegex.test(pathname)) {
    const accessToken = cookies().get('access_token')
    // const refreshToken = cookies().get('refresh_token')
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    console.log('ra')
    return NextResponse.redirect(new URL('/admin', request.url))
  }
}

export const config = {

}