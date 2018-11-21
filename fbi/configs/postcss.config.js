module.exports = (opts, root) => {
  return {
    useConfigFile: false,
    ident: 'postcss',
    plugins: [
      require('postcss-import')({
        root
      }),
      require('../plugins/precss')()
    ].concat(
      Object.keys(opts.styles.plugins || {}).map(item =>
        require(`${item}`)(opts.styles.plugins[item])
      )
    )
  }
}
