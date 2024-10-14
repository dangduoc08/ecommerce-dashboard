'use server'

import { redirect, RedirectType } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import { v1, FetchError, IApiResponse } from '@/actions/fetch'

export interface IAuthRecoverBody {
  password: string
  confirm_password: string
}

export interface IAuthRecoverResponse {
  recovered: boolean
}

export default async function recover(
  prevState: IApiResponse<IAuthRecoverResponse>,
  recoverReq?: { body: IAuthRecoverBody; headers?: HeadersInit },
): Promise<IApiResponse<IAuthRecoverResponse>> {
  let recovered = false

  try {
    const password = recoverReq?.body.password
    const confirm_password = recoverReq?.body.confirm_password

    if (password !== confirm_password) {
      return {
        data: prevState.data,
        code: '422',
        error: 'Unprocessable Entity',
        message: [
          {
            field: 'confirm_password',
            namespace: 'data.username',
            reason: 'Không khớp với mật khẩu',
          },
        ],
      }
    }

    const data = {
      password,
    }

    const headersList = headers()
    const ref = headersList.get('referer')
    let recoverToken = {}
    if (ref) {
      const { searchParams } = new URL(ref)
      const name = searchParams.get('name')
      const type = searchParams.get('type')
      const token = searchParams.get('token')
      if (name) {
        recoverToken = {
          [name]: `${type} ${token}`,
        }
      }
    }

    const recoverRes = await v1.patch<IApiResponse<IAuthRecoverResponse>>(
      '/admins/auths/recover',
      { data },
      recoverToken,
    )

    if (recoverRes.data) {
      recovered = recoverRes.data?.recovered ?? false

      return {
        ...recoverRes,
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
  } finally {
    if (recovered) {
      const cookie = cookies()
      cookie.getAll().forEach((cookieValue) => cookie.delete(cookieValue.name))
      redirect('/admin', RedirectType.replace)
    }
  }
}
