import path from 'path'
import fs from 'fs'

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'sideral2.0',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/assets/style/main.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/vuelidate.js',
    '@/plugins/moment.js'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [

    ['@nuxtjs/fontawesome', {
      component: 'fa',
      icons: {
        solid: true,
        brands: [
          'faNode',
          'faVuejs'
        ]
      }
    }]
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',

    '@nuxtjs/auth-next'],

  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    icons: true
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  auth: {
    // Options
    redirect: {
      login: '/login', // redirect user when not connected
      callback: '/auth/signed-in'
    },

    strategies: {
      auth0: {
        domain: 'dev-2yfbgjq3.us.auth0.com',
        clientId: 'nLbsrwpaRUJ3Rk83Wz2IflkZE3BkqUTL',
        logoutRedirectUri: 'https://localhost:8000/login',
        audience: 'https://localhost:3000'
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },

  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'secrets', 'server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'secrets', 'server.crt'))
    },

    port: 8000, // default: 3000
    host: '0.0.0.0' // default: localhost
  } // other configs
}
