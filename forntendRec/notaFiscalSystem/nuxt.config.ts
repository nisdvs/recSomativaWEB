export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'nuxt-primevue',
    '@sidebase/nuxt-auth' 
  ], 
  css: [ 
    'primevue/resources/themes/aura-light-green/theme.css',   
    'primeicons/primeicons.css',
  ], 
  plugins: ['~/plugins/pinia.js'],
  auth: {
    baseURL: 'https://recsomativaweb-production.up.railway.app',
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/token/login', method: 'post' },
        signOut: { path: '/token/logout', method: 'post' },
        getSession: { path: '/users', method: 'get' },
      },
      token: { signInResponseTokenPointer: '/auth_token', type: 'Token' },
      pages: { login: '../login' },
      sessionDataType: {
        results: 'Array'
      }
    }
  }
});
