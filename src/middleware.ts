import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import getMe from '@/actions/auths/getMe'
import refreshToken from '@/actions/auths/refreshToken'
import { Path } from '@/constants'

const AUTH_PATHS = [Path.DashBoard]

export async function middleware(request: NextRequest) {
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()
  const { pathname } = request.nextUrl

  if (AUTH_PATHS?.includes(pathname as Path) || pathname === Path.Admin) {
    let cookieValue: string = allCookies.reduce((acc, cur) => {
      return `${acc}; ${cur.name}=${cur.value}`
    }, '')

    try {
      let getMeResp = await getMe({ data: null, error: null }, { headers: { Cookie: cookieValue } })
      if (getMeResp.data && pathname === Path.Admin) {
        return NextResponse.redirect(new URL(AUTH_PATHS[0], request.url))
      }

      if (!getMeResp.data) {
        const refreshTokenResp = await refreshToken(
          { data: null, error: null },
          { headers: { Cookie: cookieValue } },
        )
        if (refreshTokenResp.data) {
          const { access } = refreshTokenResp.data
          const response = NextResponse.next()
          response.cookies.set({
            name: access.name,
            value: `${access.type} ${access.token}`,
            httpOnly: true,
            maxAge: access.exp,
            secure: true,
          })

          cookieValue += `; ${access.name}=${access.type} ${access.token}`
          getMeResp = await getMe({ data: null, error: null }, { headers: { Cookie: cookieValue } })

          if (!getMeResp.data && pathname !== Path.Admin) {
            return NextResponse.redirect(new URL(Path.Admin, request.url))
          } else if (getMeResp.data && pathname === Path.Admin) {
            return NextResponse.redirect(new URL(AUTH_PATHS[0], request.url))
          }

          return response
        } else if (pathname !== Path.Admin) {
          return NextResponse.redirect(new URL(Path.Admin, request.url))
        }
      }
    } catch (err) {
      if (pathname !== Path.Admin) {
        return NextResponse.redirect(new URL(Path.Admin, request.url))
      }
    }
  }
}
