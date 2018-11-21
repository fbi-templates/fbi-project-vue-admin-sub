const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AutoDllPlugin = require('autodll-webpack-plugin')
const webpackBaseConfig = require('./webpack.base')
const postcssConfig = require('./postcss.config')
const dataForCompile = require('./data-for-compile')

const opts = ctx.options
const root = process.cwd()
const script =
  'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
const hotMiddlewareScript = ctx.nodeModulesPaths[1]
  ? path.join(ctx.nodeModulesPaths[1], script)
  : script
const templateData = dataForCompile(false)
let templateFilepath = path.join(
  root,
  opts.paths.public || 'public',
  'index.html'
)
if (!fs.existsSync(templateFilepath)) {
  templateFilepath = templateFilepath.replace('.html', '.ejs')
}

const config = {
  mode: 'development',
  entry: {
    app: [
      path.join(root, opts.paths.main || 'src/main.js'),
      hotMiddlewareScript
    ]
  },
  output: {
    path: path.join(root, opts.server.root, opts.paths.assets),
    filename: 'js/[name].js',
    publicPath: opts.paths.assets ? `/${opts.paths.assets}/` : '/',
    pathinfo: false
  },
  // For development, use cheap-module-eval-source-map. For production, use cheap-module-source-map.
  devtool: ctx.options.sourcemap ? ctx.options.sourcemap[0] : false,
  module: {
    rules: [
      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: postcssConfig(opts, root)
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      templateParameters: templateData,
      template: templateFilepath,
      filename: '../index.html',
      cache: true
    }),
    new AutoDllPlugin({
      debug: true,
      inject: true,
      path: 'js',
      filename: '[hash].dll.js',
      entry: {
        vendor: opts.dllEntries || ['vue', 'vuex', 'vue-router', 'element-ui']
      }
    })
  ]
}

module.exports = merge(webpackBaseConfig, config)
