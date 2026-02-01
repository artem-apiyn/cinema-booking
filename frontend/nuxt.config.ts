export default defineNuxtConfig({
  compatibilityDate: '2026-01-29',
  devtools: { enabled: true },
  
  ssr: true,
  srcDir: 'app',
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    '@nuxt/eslint',
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3022'
    }
  },

  typescript: {
    strict: true,
    typeCheck: false
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Cinema Booking',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Book cinema tickets online' }
      ]
    }
  }
})
