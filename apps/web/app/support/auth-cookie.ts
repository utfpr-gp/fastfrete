import type { User } from '~~/domains/auth/entities/user.entity'

export const COOKIE_KEY = 'fastfrete_auth'

export interface AuthCookieData {
  user: User | null
  accessToken: string | null
}

export function getAuthCookie(): AuthCookieData | null {
  if (import.meta.server) {
    try {
      const event = useRequestEvent()
      if (!event) return null
      const cookieHeader = event.node.req.headers.cookie
      if (!cookieHeader) return null
      const match = cookieHeader.match(new RegExp(`${COOKIE_KEY}=([^;]+)`))
      if (!match) return null
      return JSON.parse(decodeURIComponent(match[1]))
    } catch {
      return null
    }
  }

  if (import.meta.client) {
    try {
      const match = document.cookie.match(new RegExp(`${COOKIE_KEY}=([^;]+)`))
      if (!match) return null
      return JSON.parse(decodeURIComponent(match[1]))
    } catch {
      return null
    }
  }

  return null
}

export function setAuthCookie(data: AuthCookieData): void {
  if (import.meta.server) {
    try {
      const event = useRequestEvent()
      if (!event) return
      setCookie(event, COOKIE_KEY, data, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      })
    } catch {
      // silently fail
    }
    return
  }

  if (import.meta.client) {
    try {
      const encoded = encodeURIComponent(JSON.stringify(data))
      document.cookie = `${COOKIE_KEY}=${encoded}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    } catch {
      // silently fail
    }
  }
}

export function clearAuthCookie(): void {
  if (import.meta.server) {
    try {
      const event = useRequestEvent()
      if (!event) return
      setCookie(event, COOKIE_KEY, null, {
        maxAge: 0,
        path: '/'
      })
    } catch {
      // silently fail
    }
    return
  }

  if (import.meta.client) {
    document.cookie = `${COOKIE_KEY}=; path=/; max-age=0`
  }
}
