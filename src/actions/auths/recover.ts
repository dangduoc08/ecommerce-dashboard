'use server'

import { redirect, RedirectType } from 'next/navigation'
import { IApiResponse, IAuthRecoverResponse } from '@/actions/interface'
import { v1, FetchError } from '@/actions/fetch';

const sleep = (t: number) => new Promise(r => setTimeout(r, t))

export default async function recover(prevSessionState: IApiResponse<IAuthRecoverResponse> & { shouldComponentRender: boolean; token?: string }, formData: FormData) {
  const shouldComponentRender = !prevSessionState.shouldComponentRender
  let recovered = false

  try {
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')
    if (password !== confirmPassword) {
      return {
        code: "422",
        error: "Unprocessable Entity",
        messages: [
          {
            "field": "confirmPassword",
            "namespace": "data.username",
            "reason": "Không khớp với mật khẩu"
          }
        ],
        token: prevSessionState.token,
        shouldComponentRender
      }
    }

    const data = {
      password,
    }

    const resp = await v1.patch<IApiResponse<IAuthRecoverResponse>>('/admins/auths/recover', { data }, { 'recover_token': prevSessionState.token || '' })
    recovered = resp.data?.recovered ?? false


    return {
      ...resp,
      token: prevSessionState.token,
      shouldComponentRender
    }
  } catch (_err) {
    const err = _err as FetchError
    return {
      code: err.code,
      error: err.error,
      message: err.message,
      messages: err.messages,
      token: prevSessionState.token,
      shouldComponentRender
    }
  } finally {
    redirect('/admin', RedirectType.replace)
  }
}
