// 'METHOD url': (req, res, next, db) => {}
// const table = db[tableName].get(tableName); see json files in './db'

module.exports = {
  'POST /login': (req, res, next, db) => {
    const params = req.body

    if (!params.username || !params.password) {
      return res.status(200).json({
        code: -1,
        message: '"name" and "password" is required.'
      })
    }

    const user = db['users']
      .get('users')
      .find({
        username: params.username
      })
      .value()

    // check if user exist
    if (!user) {
      return res.status(200).json({
        code: -1,
        message: `user "${params.username}" not found.`
      })
    }

    // check password
    if (user.password !== params.password) {
      return res.status(200).json({
        code: -1,
        message: 'wrong password'
      })
    }

    // return user info (except 'password')
    const data = JSON.parse(JSON.stringify(user))
    delete data.password
    res.status(200).json({
      code: 0,
      data
    })
    next()
  }
}
