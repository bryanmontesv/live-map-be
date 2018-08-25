'use strict'
const config = require('../config/index')
const knex = require('knex')({ client: config.database.client, useNullAsDefault: config.database.useNullAsDefault })
const database = require('../database/sqlite/databaseHelper')

const getLocations = () => {
  const query = knex
    .select('*')
    .from('locations')
    .toString()

  return database.getHelper(query)
}
/**
 * TODO -> Create function to receive many locations at the time
 * @param {Object} payload location object which is going to be stored on database
 */
const createLocation = (payload) => {
  const query = knex('locations')
    .insert([{
      latitude: payload.latitude,
      longitude: payload.longitude,
      location_name: payload.location_name,
      open_time: payload.open_time,
      close_time: payload.close_time
    }])
    .toString()

  return database.runHelper(query, 'locations')
}

/**
 * TODO -> Handle multi-updates
 * @param {Object} payload location object which is going to be updated on database
 */
const updateLocation = (payload) => {
  const query = knex('locations')
    .where({ id: payload.id })
    .update({
      latitude: payload.latitude,
      longitude: payload.longitude,
      location_name: payload.location_name,
      open_time: payload.open_time,
      close_time: payload.close_time,
      updated_at: knex.fn.now()
    })
    .toString()

  return database.runHelper(query, 'locations')
}

module.exports = {
  getLocations,
  createLocation,
  updateLocation
}
