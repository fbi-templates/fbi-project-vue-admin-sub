// tooling
const postcss = require('postcss')
const postcssAdvancedVariables = require('postcss-advanced-variables')
const postcssAtroot = require('postcss-atroot')
const postcssExtendRule = require('postcss-extend-rule')
const postcssNested = require('postcss-nested')
const postcssPresetEnv = require('postcss-preset-env')
const postcssPropertyLookup = require('postcss-property-lookup')

// plugin chain
const plugins = [
  postcssExtendRule,
  postcssAdvancedVariables,
  postcssPresetEnv,
  postcssAtroot,
  postcssPropertyLookup,
  postcssNested
]

// plugin
module.exports = postcss.plugin('precss', rawopts => {
  // initialize options, defaulting preset-env to stage 0 features
  const opts = Object.assign({ stage: 0 }, rawopts)

  // initialize all plugins
  const initializedPlugins = plugins.map(plugin => plugin(opts))

  // process css with all plugins
  return (root, result) =>
    initializedPlugins.reduce(
      (promise, plugin) => promise.then(() => plugin(result.root, result)),
      Promise.resolve()
    )
})
