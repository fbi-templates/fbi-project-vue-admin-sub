const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const dataForCompile = require('./data-for-compile')

const opts = ctx.options
const webpackData = dataForCompile()
const devModulesPath = ctx.nodeModulesPaths[1] || './node_modules'

// Babel
const babelOptions = require('../helpers/babel-options')(
  Object.assign(
    {},
    {
      babelrc: false,
      cacheDirectory: true,
      plugins: ['@babel/plugin-syntax-dynamic-import', 'babel-plugin-transform-vue-jsx']
    },
    opts.scripts || {}
  ),
  devModulesPath
)

// remove warning:
// DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic, see https://github.com/webpack/loader-utils/issues/56
// parseQuery() will be replaced with getOptions() in the next major version of loader-utils.
process.noDeprecation = true

const config = {
  target: 'web',
  resolve: {
    extensions: ['*', '.js', '.vue', '.css', '.json'],
    alias: opts.alias,
    // https://github.com/benmosher/eslint-plugin-import/issues/139#issuecomment-287183200
    modules: ctx.nodeModulesPaths.concat([path.resolve(__dirname, '..', 'src')])
  },
  resolveLoader: {
    modules: ctx.nodeModulesPaths
  },
  module: {
    noParse: opts.noParse ? opts.noParse : [],
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      // https://github.com/kazupon/vue-i18n-loader#custom-blocks-single-file-components
      // http://kazupon.github.io/vue-i18n/guide/sfc.html#webpack
      {
        resourceQuery: /blockType=i18n/,
        loader: '@kazupon/vue-i18n-loader'
      },
      // this will apply to both plain `.js` files
      // AND `<script>` blocks in `.vue` files
      {
        test: /\.js?$/,
        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file),
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.resolve('node_modules/.cache/cache-loader')
            }
          },
          {
            loader: 'babel-loader',
            options: babelOptions
          }
        ]
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        // include: [utils.resolve('src')],
        options: {
          symbolId: 'icon-[name]',
          extract: false,
          runtimeCompat: true,
          esModule: false
        }
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 5000,
          name: process.env.NODE_ENV === 'production' ? 'img/[name].[hash:8].[ext]' : 'img/[name].[ext]?[hash:8]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 5000,
          name: process.env.NODE_ENV === 'production' ? 'media/[name].[hash:8].[ext]' : 'media/[name].[ext]?[hash:8]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 5000,
          name: process.env.NODE_ENV === 'production' ? 'fonts/[name].[hash:8].[ext]' : 'fonts/[name].[ext]?[hash:8]'
        }
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      }
    ]
  },
  plugins: [new VueLoaderPlugin(), new webpack.DefinePlugin(webpackData), new webpack.ProgressPlugin(), new FriendlyErrorsWebpackPlugin()],
  performance: {
    hints: false
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  cache: true,
  // Fail out on the first error
  bail: true,
  // Limit the number of parallel processed modules
  parallelism: 1
}

if (opts.lint.scripts.enable) {
  config.module.rules.push({
    test: /\.(vue|js)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    exclude: file => opts.lint.scripts.exclude.some(item => new RegExp(item).test(file)),
    options: ctx.utils.assign(
      {},
      {
        cache: true,
        root: true,
        parser: 'babel-eslint',
        extends: 'eslint-config-standard',
        formatter: require('eslint-friendly-formatter'),
        plugins: ['html'],
        parserOptions: {
          ecmaVersion: 8,
          sourceType: 'module',
          ecmaFeatures: {
            experimentalObjectRestSpread: true
          }
        },
        env: {
          browser: true
        },
        rules: {
          // rules docs: https://standardjs.com/rules.html
          semi: ['error', 'never'],
          indent: [
            'error',
            2,
            {
              SwitchCase: 1
            }
          ]
        }
      },
      opts.lint.scripts.options
    )
  })
}

module.exports = config
