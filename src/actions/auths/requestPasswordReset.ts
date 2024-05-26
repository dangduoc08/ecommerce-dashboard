'use server'

import { headers } from "next/headers";
import { IApiResponse, IAuthRequestPasswordReset } from '@/actions/interface'
import { v1, FetchError } from '@/actions/fetch';

export default async function requestPasswordReset(prevSessionState: IApiResponse<IAuthRequestPasswordReset> & { shouldComponentRender: boolean }, formData: FormData) {
  const shouldComponentRender = !prevSessionState.shouldComponentRender
  try {
    const headersList = headers();
    const domain = headersList.get("x-forwarded-host") || "";
    const proto = headersList.get("x-forwarded-proto") || "";

    const user_identity = formData.get('user_identity')
    const data = {
      user_identity,
    }

    const resp = await v1.patch<IApiResponse<IAuthRequestPasswordReset>>('/admins/auths/request_password_reset', { data }, { Origin: `${proto}://${domain}` })

    return {
      ...resp,
      shouldComponentRender
    }
  } catch (_err) {
    const err = _err as FetchError
    return {
      code: err.code,
      error: err.error,
      message: err.message,
      messages: err.messages,
      shouldComponentRender
    }
  }
} 