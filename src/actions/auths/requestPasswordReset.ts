'use server'

import { headers } from 'next/headers'
import { v1, FetchError, IApiResponse } from '@/actions/fetch'

export interface IAuthRequestPasswordResetBody {
  user_identity: string
}

export interface IAuthRequestPasswordResponse {
  requested: boolean
}

export default async function requestPasswordReset(
  prevState: IApiResponse<IAuthRequestPasswordResponse>,
  requestPasswordResetReq?: { body: IAuthRequestPasswordResetBody; headers?: HeadersInit },
) {
  try {
    const userIdentity = requestPasswordResetReq?.body?.user_identity
    const data = {
      user_identity: userIdentity,
    }
    const headersList = headers()

    const resp = await v1.post<IApiResponse<IAuthRequestPasswordResponse>>(
      '/admins/auths/request_password_reset',
      { data },
      {
        Origin: headersList.get('origin')?.toString() ?? '',
        ...requestPasswordResetReq?.headers,
      },
    )

    return {
      ...resp,
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
