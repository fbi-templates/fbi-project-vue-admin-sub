const fs = require('fs')
const path = require('path')
const low = require('lowdb')
const faker = require('faker')
const FileSync = require('lowdb/adapters/FileSync')

const basePath = path.join(process.cwd(), 'mock')
const dbPath = path.join(basePath, 'db')

async function jsonDB (schema) {
  const db = {}

  for (let i = 0, len = schema.length; i < len; i++) {
    const item = schema[i]
    const name = item.name
    const filepath = path.join(dbPath, `${name}.json`)
    let needInit = !fs.existsSync(filepath)

    if (!needInit) {
      const tmp = require(filepath)
      needInit = tmp.length <= 0 || Object.keys(tmp).length <= 0
    }

    const defaultValue = {}
    const defaultData = []

    if (needInit) {
      for (let i = 0; i < item.number; i++) {
        const str = JSON.stringify(item.schema)
        const rep = faker
          .fake(str)
          .replace(/\n/g, '\\\\n')
          .replace(/\r/g, '\\\\r')
        defaultData.push(JSON.parse(rep))
      }
      defaultValue[name] = defaultData
    }

    db[name] = await low(
      new FileSync(filepath, {
        defaultValue
      })
    )
  }

  return db
}

async function initDb () {
  const schema = require(path.join(basePath, 'schema.json'))
  return await jsonDB(schema)
}

const actions = {
  one (table) {
    return (req, res, next) => {
      const data = table
        .find({
          id: req.params.id
        })
        .value()

      if (data) {
        res.json({
          code: 0,
          data
        })
      } else {
        res.json({
          code: -1,
          message: 'no data'
        })
      }

      next()
    }
  },
  some (table) {
    return (req, res, next) => {
      const hasQuery = Object.keys(req.query).length > 0
      let data

      if (hasQuery) {
        data = table.find(req.query).value()
      } else {
        data = table.value()
      }

      if (data) {
        res.json({
          code: 0,
          data
        })
      } else {
        res.json({
          code: -1,
          message: 'no data'
        })
      }
      next()
    }
  },
  add (table) {
    return (req, res, next) => {
      try {
        const data = table.push(req.body).write()

        res.json({
          code: 0,
          data
        })
      } catch (err) {
        res.json({
          code: -1,
          message: err.message
        })
      }
      next()
    }
  },
  update (table) {
    return (req, res, next) => {
      try {
        const data = table
          .find({
            id: req.params.id
          })
          .assign(req.body)
          .write()

        res.json({
          code: 0,
          data
        })
      } catch (err) {
        res.json({
          code: -1,
          message: err.message
        })
      }
      next()
    }
  },
  remove (table) {
    return (req, res, next) => {
      const id = req.params.id
      try {
        const data = table
          .remove({
            id
          })
          .write()

        res.json({
          code: 0,
          data
        })
      } catch (err) {
        res.json({
          code: -1,
          message: err.message
        })
      }
      next()
    }
  }
}

function initMiddlewares (app, db, prefix) {
  for (let key of Object.keys(db)) {
    const table = db[key].get(key)

    // /users
    app
      .route(`${prefix}/${key}`)
      .get(actions.some(table))
      .post(actions.add(table))

    // /users/:id
    app
      .route(`${prefix}/${key}/:id`)
      .get(actions.one(table))
      .put(actions.update(table))
      .post(actions.update(table))
      .delete(actions.remove(table))
  }

  let customs
  try {
    customs = require(path.join(basePath, 'middleware'))
  } catch (err) {}

  if (customs) {
    for (let [key, fn] of Object.entries(customs)) {
      const tmp = key.split(' ')
      const method = tmp[0].toLowerCase()
      const url = tmp[1]
      app.route(path.join(prefix, url))[method]((req, res, next) =>
        fn(req, res, next, db)
      )
    }
  }
}

module.exports = {
  initDb,
  initMiddlewares
}
