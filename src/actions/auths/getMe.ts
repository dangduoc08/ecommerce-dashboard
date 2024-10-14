'use server'

import { v1, FetchError, IApiResponse } from '@/actions/fetch'

export interface IAuthMeResponse {
  id: number
  store_id: number
  email: string
  first_name: string
  last_name: string
  permissions: Array<any>
}

export default async function getMe(
  prevState: IApiResponse<IAuthMeResponse>,
  meReq?: { headers?: HeadersInit },
) {
  try {
    const resp = await v1.get<IApiResponse<IAuthMeResponse>>('/admins/auths/me', meReq?.headers)

    if (resp.data) {
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
