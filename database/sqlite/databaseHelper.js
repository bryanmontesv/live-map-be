'use strict'
const path = require('path')
const config = require('../../config/index')
const dbPath = path.resolve(__dirname, config.database.path)
const sqlite3 = require('sqlite3').verbose()
var knex = require('knex')({ client: 'sqlite3' })

// open database in memory
console.log('conf.database.path', dbPath)
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message)
  }
  console.log('Connected to the in-memory SQlite database.')
})

const closeDbConnection = () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message)
    }
    console.log('Close the database connection.')
  })
}

/**
 *
 * @param {String} queryStatement a query string received to make some request to a database
 */
let getHelper = (queryStatement) => {
  return new Promise((resolve, reject) => {
    db.all(queryStatement, [], (err, rows) => {
      if (err) {
        reject(err)
      }
      resolve(rows)
    })
  })
}

/**
 *
 * @param {String} queryStatement query string received to insert or update something on certain table
 * @param {String} table database table which is going to work to extract last item/row information
 */
let runHelper = (queryStatement, table) => {
  console.log('queryStatement', queryStatement)
  return new Promise((resolve, reject) => {
    db.run(queryStatement, [], function (err) {
      if (err) {
        reject(err.message)
      }
      const queryArray = queryStatement.split('=')
      resolve(this.lastID > 0 ? this.lastID : queryArray[queryArray.length - 1])
    })
  }).then((lastId) => {
    const query = knex
      .select('*')
      .from(table)
      .where({ id: lastId })
      .toString()

    return getHelper(query)
  }).then((results) => {
    return results
  }).catch((err) => {
    return err
  })
}

// close the database connection
// closeDbConnection()

module.exports = {
  getHelper,
  runHelper
}
