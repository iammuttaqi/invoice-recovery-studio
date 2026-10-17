// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt'
  ],

  css: [
    '~/assets/css/tailwind.css'
  ],

  app: {
    head: {
      title: 'InvoiceRecovery Studio — Overdue Receivables & Statutory Legal Engine',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Automated statutory interest calculation, 4-stage escalation notices, 48-hour prompt settlement formulation, and legal letterhead generation under US, UK, and EU late payment statutes.'
        },
        { name: 'theme-color', content: '#f8fafc' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap'
        }
      ]
    }
  },

  typescript: {
    strict: true
  },

  nitro: {
    experimental: {
      wasm: true
    }
  }
})
