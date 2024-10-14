'use server'

import { cookies } from 'next/headers'
import { v1, FetchError, IApiResponse } from '@/actions/fetch'

export interface IAuthSigninBody {
  username: string
  password: string
}

export interface IAuthSigninResponseToken {
  exp: number
  token: string
  type: string
  name: string
}

export interface IAuthSigninResponse {
  access: IAuthSigninResponseToken
  refresh: IAuthSigninResponseToken
}

export default async function signin(
  prevState: IApiResponse<IAuthSigninResponse>,
  signinReq?: { body: IAuthSigninBody; headers?: HeadersInit },
) {
  try {
    const username = signinReq?.body.username
    const password = signinReq?.body.password
    const data = {
      username,
      password,
    }

    const signinRes = await v1.post<IApiResponse<IAuthSigninResponse>>(
      '/admins/auths/signin',
      {
        data,
      },
      signinReq?.headers,
    )

    if (signinRes.data && signinRes.data?.access && signinRes.data?.refresh) {
      const { access, refresh } = signinRes.data
      const cookieStore = cookies()

      cookieStore.set(access.name, `${access.type} ${access.token}`, {
        httpOnly: true,
        maxAge: access.exp,
        secure: true,
      })
      cookieStore.set(refresh.name, `${refresh.type} ${refresh.token}`, {
        httpOnly: true,
        maxAge: refresh.exp,
        secure: true,
      })

      return {
        ...signinRes,
        error: prevState.error || null,
      }
    }

    return {
      data: prevState.data || null,
      error: prevState.error || null,
    }
  } catch (_err) {
    const err = _err as FetchError
    return {
      ...err,
      data: prevState.data || null,
    }
  }
}
