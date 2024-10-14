import { cookies } from 'next/headers'

export interface IApiError {
  field: string
  namespace: string
  reason: string
}

export interface IApiResponse<T> {
  data: T | null
  error: string | null
  code?: string
  message?: string | IApiError[] | Record<string, unknown>
}

export class FetchError extends Error {
  constructor(public message: string, public code: string, public error: string) {
    super(message)
    this.code = code
    this.error = error
  }
}

export default class Fetch {
  constructor(
    private baseURL: string,
    private versionKey: string,
    private versionValue: string,
    private headers?: HeadersInit,
  ) {
    this.baseURL = baseURL
    this.versionKey = versionKey
    this.versionValue = versionValue
    this.headers = headers
  }

  private removeLastSlash(url: string) {
    if (url.endsWith('/')) {
      return url.substring(0, url.length - 1)
    }
    return url
  }

  private addFirstSlash(url: string) {
    if (!url.startsWith('/')) {
      return '/' + url
    }
    return url
  }

  private isRequestSuccess(status: number): boolean {
    return status >= 200 && status < 400
  }

  private buildURL(path: string): string {
    return this.removeLastSlash(this.baseURL) + this.addFirstSlash(path)
  }

  public get<T>(path: string, headers: HeadersInit = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      fetch(this.buildURL(path), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          [this.versionKey]: this.versionValue,
          ...this.headers,
          ...headers,
        },
      })
        .then(async (resp) => {
          const respJSON = await resp.json()
          const { code, error, message } = respJSON
          if (!this.isRequestSuccess(resp.status)) {
            throw new FetchError(message, code, error)
          }

          resolve(respJSON)
        })
        .catch((error) => reject(error))
    })
  }

  public post<T>(
    path: string,
    body: Record<string, unknown>,
    headers: HeadersInit = {},
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      fetch(this.buildURL(path), {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          [this.versionKey]: this.versionValue,
          ...this.headers,
          ...headers,
        },
      })
        .then(async (resp) => {
          const respJSON = await resp.json()
          const { code, error, message } = respJSON
          if (!this.isRequestSuccess(resp.status)) {
            throw new FetchError(message, code, error)
          }

          resolve(respJSON)
        })
        .catch((error) => reject(error))
    })
  }

  public put<T>(
    path: string,
    body: Record<string, unknown>,
    headers: HeadersInit = {},
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      fetch(this.buildURL(path), {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          [this.versionKey]: this.versionValue,
          ...this.headers,
          ...headers,
        },
      })
        .then(async (resp) => {
          const respJSON = await resp.json()
          const { code, error, message } = respJSON
          if (!this.isRequestSuccess(resp.status)) {
            throw new FetchError(message, code, error)
          }

          resolve(respJSON)
        })
        .catch((error) => reject(error))
    })
  }

  public patch<T>(
    path: string,
    body: Record<string, unknown>,
    headers: HeadersInit = {},
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      fetch(this.buildURL(path), {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          [this.versionKey]: this.versionValue,
          ...this.headers,
          ...headers,
        },
      })
        .then(async (resp) => {
          const respJSON = await resp.json()
          const { code, error, message } = respJSON
          if (!this.isRequestSuccess(resp.status)) {
            throw new FetchError(message, code, error)
          }

          resolve(respJSON)
        })
        .catch((error) => reject(error))
    })
  }

  public delete<T>(path: string, headers: HeadersInit = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      fetch(this.buildURL(path), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          [this.versionKey]: this.versionValue,
          ...this.headers,
          ...headers,
        },
      })
        .then(async (resp) => {
          const respJSON = await resp.json()
          const { code, error, message } = respJSON
          if (!this.isRequestSuccess(resp.status)) {
            throw new FetchError(message, code, error)
          }

          resolve(respJSON)
        })
        .catch((error) => reject(error))
    })
  }
}

export const v1 = new Fetch(process.env.NEXT_PUBLIC_API_URL || '', 'X-Api-Version', '1', {
  locale: 'vi_VN',
})
