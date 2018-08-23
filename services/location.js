'use strict'

var knex = require('knex')({ client: 'sqlite3' })
const database = require('../database/sqlite/databaseHelper')

const getLocations = () => {
  const query = knex
    .select('*')
    .from('locations')
    .toString()

  return database.getHelper(query)
}

const createLocation = () => {
  const query = knex
    .select('*')
    .from('locations')
    .toString()

  return database.getHelper(query)
}

const updateLocation = () => {
  const query = knex
    .select('*')
    .from('locations')
    .toString()

  return database.getHelper(query)
}

module.exports = {
  getLocations,
  createLocation,
  updateLocation
}
