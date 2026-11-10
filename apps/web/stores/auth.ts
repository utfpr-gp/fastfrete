import { defineStore } from 'pinia'
import { createAuthService } from '~~/domains/auth/composition'
import { createUserService } from '~~/domains/users/composition'
import type { User } from '~~/domains/auth/entities/user.entity'
import { getAuthCookie, setAuthCookie, clearAuthCookie } from '~/support/auth-cookie'
import type { AuthCookieData } from '~/support/auth-cookie'

export interface AuthState {
  user: User | null
  accessToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    const cookieData = getAuthCookie()
    return cookieData || { user: null, accessToken: null }
  },

  getters: {
    getUser: (state) => state.user,
    isAuthenticated: (state) => !!state.accessToken,
    isCarrier: (state) => !!state.user && state.user.roles[0]?.name === 'CARRIER',
    isClient: (state) => !!state.user && state.user.roles[0]?.name === 'CUSTOMER',
    isAdmin: (state) => !!state.user && state.user.roles[0]?.name === 'ADMIN'
  },

  actions: {
    setSession(accessToken: string, user: User) {
      this.accessToken = accessToken
      this.user = user
      this.persist()
    },

    async login(form: { email: string; password: string }) {
      const authService = createAuthService()
      const response = await authService.login(form)

      if (response.success) {
        this.setSession(response.data.accessToken, response.data.user)
      }

      return response
    },

    async ensureUserIsLoaded() {
      if (!this.accessToken) return

      const userService = createUserService()
      const result = await userService.getProfile()

      if (result.success) {
        this.user = result.data
        this.persist()
      } else {
        this.logout()
      }
    },

    logout() {
      this.accessToken = null
      this.user = null
      clearAuthCookie()
      navigateTo('auth/login')
    },

    persist() {
      const data: AuthCookieData = { accessToken: this.accessToken, user: this.user }
      setAuthCookie(data)
    }
  }
})
