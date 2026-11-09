import { useAuthStore } from '~~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const unauthenticatedRoutes = [
    '/auth/login',
    '/auth/sign-up',
    '/auth/reset-password',
    '/auth/forgot-password'
  ]

  if (!unauthenticatedRoutes.includes(to.path) && !isAuthenticated) {
    return navigateTo('/auth/login')
  }

  if (unauthenticatedRoutes.includes(to.path) && isAuthenticated) {
    return navigateTo('/')
  }
})
