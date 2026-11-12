export interface IHttpClient {
  get<T>(url: string, options?: RequestOptions): Promise<HttpResult<T>>
  post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<HttpResult<T>>
  put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<HttpResult<T>>
  patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<HttpResult<T>>
  delete<T>(url: string, options?: RequestOptions): Promise<HttpResult<T>>
}

export interface RequestOptions {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
}

export interface HttpError {
  code: number
  message: string
}

export type HttpResult<T> = { success: true; data: T } | { success: false; error: HttpError }
