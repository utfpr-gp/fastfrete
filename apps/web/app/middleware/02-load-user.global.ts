import { useAuthStore } from '~~/stores/auth'

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated && !authStore.getUser) {
    await authStore.ensureUserIsLoaded()
  }
})
