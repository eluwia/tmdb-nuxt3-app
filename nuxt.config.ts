export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/image'],
  runtimeConfig: {
    tmdbApiKey: process.env.NUXT_TMDB_API_KEY,
    public: {
      imgBase: 'https://image.tmdb.org/t/p'
    }
  },
  debug: false,
  ssr: true,
  nitro: {
    experimental: {
      wasm: true
    }
  },
  css: ['~/assets/tailwind.css'],
  router: {
    options: {
      strict: false
    }
  },
  vite: {
    server: {
      hmr: {
        overlay: false
      }
    }
  }
})