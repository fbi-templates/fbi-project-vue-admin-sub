const path = require('path')

function resolve (dir) {
  return path.join(process.cwd(), dir)
}

module.exports = {
  resolve
}
