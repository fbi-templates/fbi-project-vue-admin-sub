module.exports = (stringify = true) => {
  const data = Object.assign(
    {},
    ctx.options.data.all || {},
    ctx.options.data[ctx.env]
  )

  if (data && typeof data === 'object' && Object.keys(data).length > 0) {
    const copy = JSON.parse(JSON.stringify(data))
    copy['ENV'] = ctx.env

    if (stringify) {
      Object.keys(copy).map(item => {
        switch (typeof item) {
          case 'string':
            copy[item] = JSON.stringify(copy[item])
            break
        }
      })
    }

    return copy
  }

  return {}
}
