'use server'

import { v1, FetchError, IApiResponse } from '@/actions/fetch'
import { IAuthSigninResponseToken } from './signin'

export interface IAuthRefreshTokenResponse {
  access: IAuthSigninResponseToken
}

export default async function refreshToken(
  prevState: IApiResponse<IAuthRefreshTokenResponse>,
  refreshTokenReq?: { headers?: HeadersInit },
) {
  try {
    const resp = await v1.post<IApiResponse<IAuthRefreshTokenResponse>>(
      '/admins/auths/refresh_token',
      {},
      refreshTokenReq?.headers,
    )
    if (resp.data && resp.data?.access) {
      return {
        ...resp,
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
