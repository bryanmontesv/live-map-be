'use strict'
const path = require('path')
const config = require('../../config/index')
const dbPath = path.resolve(__dirname, config.database.path)
const sqlite3 = require('sqlite3').verbose()

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

let runHelper = (queryStatement, values = []) => {
  let placeholders = values.map(() => '(?)').join(',')
  let query = `${queryStatement} ${placeholders}`
  return new Promise((resolve, reject) => {
    db.run(query, values, function (err) {
      if (err) {
        reject(err.message)
      }
      console.log('whats this: ', this)
      resolve(this)
      // return this.lastID
    })
  })
}

// close the database connection
// closeDbConnection()

module.exports = {
  getHelper,
  runHelper
}
