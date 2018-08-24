const config = require('../../../config/index')
const path = require('path')
const dbPath = path.resolve(__dirname, `../${config.database.path}`)

var knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: dbPath }
})

const tableExists = (tableName) => {
  return knex.schema.hasTable(tableName)
    .then((response, err) => {
      if (err) {
        console.log(err)
        process.exit(1)
      }
      return response
    })
}
/**
 * Creation of location and audit tables for the first time.
 */

(() => {
  tableExists('locations')
    .then((hasTable) => {
      if (!hasTable) {
        return knex.schema.createTable('locations', function (table) {
          table.increments('id').primary()
          table.string('latitude')
          table.string('longitude')
          table.string('location_name')
          table.date('open_time')
          table.date('close_time')
          table.timestamp('updated_at')
          table.timestamp('created_at').defaultTo(knex.fn.now())
        })
      } else {
        return hasTable && 'locations table already exists'
      }
    })
    .then((response, error) => {
      if (error) {
        console.log(error)
        process.exit(1) // exit with an error
      }
      console.log(response)
    }).catch((err) => {
      console.log(err)
      process.exit(1)
    })
})();

/**
 * Audit table to store client information.
 */
(() => {
  tableExists('audit')
    .then((hasTable) => {
      if (!hasTable) {
        return knex.schema.createTable('audit', function (table) {
          table.increments('id').primary()
          table.string('event_type')
          table.string('description')
          table.string('platform')
          table.string('cookie_enabled')
          table.string('app_version')
          table.timestamp('created_at').defaultTo(knex.fn.now())
        })
      } else {
        return hasTable && 'audit table already exists'
      }
    })
    .then((response, error) => {
      if (error) {
        console.log(error)
        process.exit(1) // exit with an error
      }
      console.log(response)
      process.exit(0) // exit whithout errors
    }).catch((err) => {
      console.log(err)
      process.exit(1)
    })
})()
