'use server'

import { cookies } from 'next/headers'
import { IApiResponse, IAuthSession } from '@/actions/interface'
import { v1, FetchError } from '@/actions/fetch';

export default async function session(prevSessionState: IApiResponse<IAuthSession> & { shouldComponentRender: boolean }, formData: FormData) {
  const shouldComponentRender = !prevSessionState.shouldComponentRender
  try {
    const username = formData.get('username')
    const password = formData.get('password')
    const data = {
      username,
      password,
    }

    const resp = await v1.post<IApiResponse<IAuthSession>>('/admins/auths/sessions', { data })
    if (resp.data) {
      const { access } = resp.data
      const cookieStore = cookies()
      cookieStore.set('access_token', `${access.type} ${access.token}`, { httpOnly: true, maxAge: access.exp })
    }

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