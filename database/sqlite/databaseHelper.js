'use strict'
const path = require('path')
const config = require('../../config/index')
const dbPath = path.resolve(__dirname, config.database.path)
const knex = require('knex')({ client: config.database.client, useNullAsDefault: config.database.useNullAsDefault })
const sqlite3 = require('sqlite3').verbose()

// open database in memory
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message)
  }
  console.log('Connected to the in-memory SQlite database.')
})
// TODO: CLOSE DATABASE CONNECTION AFTER QUERY
// const closeDbConnection = () => {
//   db.close((err) => {
//     if (err) {
//       return console.error(err.message)
//     }
//     console.log('Close the database connection.')
//   })
// }

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
 * @param {Object} fields knex object, it works for getting special fields with special functions default *
 */
let runHelper = (queryStatement, table, fields = '*') => {
  return new Promise((resolve, reject) => {
    db.run(queryStatement, [], function (err) {
      if (err) {
        reject(err.message)
      }
      const queryArray = queryStatement.split('=')
      resolve(this.lastID > 0 ? this.lastID : queryArray[queryArray.length - 1])
    })
  }).then((lastId) => {
    // this is ugly and I should change this to another aproach to send strftime but it works good.
    let queryFields = fields.toString().split('select ')[1] ? fields.toString().split('select ')[1] : fields
    const query = knex
      .select(knex.raw(queryFields))
      .from(table)
      .where({ id: lastId })
      .toString()

    return getHelper(query)
  }).then((results) => results)
    .catch((err) => {
      return err
    })
}

// close the database connection
// closeDbConnection()

module.exports = {
  getHelper,
  runHelper
}
