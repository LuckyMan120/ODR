

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Guided Compliance - Online complaints management',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {
        hid: 'description',
        name: 'description',
        content: 'Guided Compliance is a custom built complaints' +
          ' managment solution ensuring compliance and efficiency and drawing on' +
          ' Alternative Dispute Resolution practices.'
      }
    ],
    link: [{rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/assets/style/main.scss',

    // quill css
    'quill/dist/quill.core.css',
    // for snow theme
    'quill/dist/quill.snow.css',
    // for bubble theme
    'quill/dist/quill.bubble.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/vuelidate.js',
    '@/plugins/axios.js',
    '@/plugins/bootstrap.js',
    {src: '@/plugins/quill-editor.js', ssr: false},
    {src: '@/plugins/sails.io.js', ssr: false}
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    [
      '@nuxtjs/eslint-module',
      {
        fix: true
      }
    ]
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/moment',
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'nuxt-i18n',
    '@nuxtjs/toast',
    ['nuxt-highcharts', {exporting: true}],
    '@nuxtjs/recaptcha'
  ],

  recaptcha: {
    hideBadge: true,
    version: 3
  },

  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },

  i18n: {
    locales: [
      {
        code: 'en-gb',
        name: 'United Kingdom English',
        file: 'en-gb.json'
      }
    ],
    defaultLocale: 'en-gb',
    lazy: true,
    langDir: 'locales/'
  },

  proxy: {
    '/api': {
      target: process.env.API_URL || 'http://localhost:1337',
      pathRewrite: {'^/api': ''}
    },
    '/socket.io': {
      target: process.env.API_URL || 'http://localhost:1337',
      secure: false,
      ws: true
    }
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.API_URL || 'http://localhost:1337',
    browserBaseURL: '/api',
    progress: true,
    proxy: true,
    proxyHeaders: true,
    debug: process.env.NODE_ENV !== 'production'
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  server: {
    host: '0.0.0.0'
  },

  toast: {
    duration: 5000,
    position: 'top-center',
    theme: 'outline'
  },

  serverMiddleware: [
    {
      path: '/version',
      handler(req, res) {
        try {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(require('./version.json')));
        } catch (err) {
          console.error(err);
          res.setHeader('Content-Type', 'text/plain');
          res.statusCode = 404;
          res.end('Not Found');
        }
      }
    }
  ],

  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
    GETSTREAM_KEY: process.env.GETSTREAM_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,

    recaptcha: {
      siteKey: process.env.RECAPTCHA_SITE_KEY
    }
  }
};
