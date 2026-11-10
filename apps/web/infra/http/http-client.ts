import { getAuthCookie } from '~/support/auth-cookie'
import type { IHttpClient, RequestOptions, HttpResult, HttpError } from './http-client.interface'

export class HttpClient implements IHttpClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async get<T>(url: string, options?: RequestOptions): Promise<HttpResult<T>> {
    return this.request<T>('GET', url, undefined, options)
  }

  async post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<HttpResult<T>> {
    return this.request<T>('POST', url, body, options)
  }

  async put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<HttpResult<T>> {
    return this.request<T>('PUT', url, body, options)
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<HttpResult<T>> {
    return this.request<T>('DELETE', url, undefined, options)
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<HttpResult<T>> {
    try {
      const token = this.getStoredToken()
      const data = await $fetch<T>(this.buildUrl(path, options?.params), {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options?.headers
        },
        body: body as any
      })
      return { success: true, data }
    } catch (error: any) {
      const httpError: HttpError = {
        code: error?.statusCode || error?.status || 500,
        message: error?.statusMessage || error?.message || 'Unknown error'
      }
      return { success: false, error: httpError }
    }
  }

  private getStoredToken(): string | null {
    try {
      const cookieData = getAuthCookie()
      return cookieData?.accessToken || null
    } catch {
      return null
    }
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(path, this.baseURL)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }
    return url.toString()
  }
}
