// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxt/icon/module', '@vee-validate/nuxt', 'nuxt-toast'],
  vite: {
    plugins: [tailwindcss()]
  },
  runtimeConfig: {
    public: {
      baseURL: 'http://localhost:3000'
    }
  }
})
