// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // SPA mode (no SSR)
  ssr: false,

  modules: ['@nuxtjs/i18n', '@nuxt/eslint'],

  eslint: {
    config: {
      stylistic: false
    }
  },

  i18n: {
    defaultLocale: 'ru',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root'
    },
    locales: [
      { code: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ]
  },

  app: {
    head: {
      title: 'Kinora',
      htmlAttrs: { lang: 'ru' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      // Base URL for media assets (gallery, etc.).
      // Default points to local public/ folder; override via NUXT_PUBLIC_CDN_BASE
      // (e.g. https://cdn.example.com) when deploying behind a CDN.
      cdnBase: '/gallery'
    }
  }
})
