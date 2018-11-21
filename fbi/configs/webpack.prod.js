const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const postcssSafeParser = require('postcss-safe-parser')
const webpackBaseConfig = require('./webpack.base')
const postcssConfig = require('./postcss.config')

const opts = ctx.options
const root = process.cwd()
const appName = opts.appName

const config = {
  mode: 'production',
  entry: path.join(root, opts.paths.build.entry),
  output: {
    path: path.join(root, opts.server.root),
    filename: `js/${appName}-app.[contenthash:8].js`,
    chunkFilename: `js/${appName}-[name].[contenthash:8].js`,
    publicPath: opts.paths.build.publicPath,
    library: `${appName}App`,
    libraryTarget: 'umd'
  },
  externals: [
    {
      vue: 'Vue'
    },
    {
      vuex: 'Vuex'
    },
    {
      'vue-router': 'VueRouter'
    }
  ],
  // For development, use cheap-module-eval-source-map. For production, use cheap-module-source-map.
  devtool: ctx.options.sourcemap ? ctx.options.sourcemap[1] : false,
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: postcssSafeParser,
          discardComments: {
            removeAll: true
          }
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: postcssConfig(opts, root)
          }
        ]
      }
    ]
  },
  plugins: [
    // new ProgressBarPlugin(),
    // short-circuits all Vue.js warning code
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new CleanWebpackPlugin([opts.server.root], {
      root: root,
      verbose: false
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: `css/${appName}-app.[hash:8].css`,
      chunkFilename: `css/${appName}-[name].[hash:8].css`
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // optimize module ids by occurrence count
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
}

module.exports = merge(webpackBaseConfig, config)
