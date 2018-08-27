'use strict'
const assert = require('chai').assert
const locationMock = require('../mocks/location.mock')
const locationService = require('../../services/location')
const config = require('../../config/index')
const knex = require('knex')({ client: config.database.client })
const database = require('../../database/sqlite/databaseHelper')

describe('Locations', function () {
  // Removing all records after when tests finishes. (Test database only)
  let insertedLocationId = null
  after(function () {
    const removeData = knex('locations')
      .del()
      .toString()

    database.runHelper(removeData)
      .then(result => {
        console.log('Result:', result)
      })
      .catch(err => {
        console.log(err)
      })
  })

  it('getAllLocations should return just the 4 locations added on the database', async () => {
    const findAllLocations = await locationService.getLocations()
    assert.lengthOf(findAllLocations, 4)
  })

  // Added timeout because windows machine takes a little bit more time to execute.
  it('createLocation should store information on the database', async () => {
    const locationCreated = await locationService.createLocation(locationMock[0])
    assert.equal(locationCreated[0].name, locationMock[0].name, `${locationMock[0].name}, inserted correctly`)
    assert.equal(locationCreated[0].first_name, locationMock[0].first_name)

    const secondLocationCreated = await locationService.createLocation(locationMock[1])
    assert.equal(secondLocationCreated[0].name, locationMock[1].name, `${locationMock[1].name}, inserted correctly`)
    assert.equal(secondLocationCreated[0].latitude, locationMock[1].latitude)
    insertedLocationId = secondLocationCreated[0].id
  }).timeout(3000)

  it('getAllLocations should return all locations on the database', async () => {
    const findAllLocations = await locationService.getLocations()
    assert.lengthOf(findAllLocations, 6)
    assert.include(findAllLocations[4].location_name, locationMock[0].location_name)
  })

  it('modifiedLocation should return the information updated after execution', async () => {
    const locationObjective = Object.assign({ id: insertedLocationId }, locationMock[2])
    const locationModified = await locationService.updateLocation(locationObjective)
    assert.include(locationModified[0].location_name, locationMock[2].location_name)
    assert.include(locationModified[0].longitude, locationMock[2].longitude)
  })

  it('getAllLocations should return all locations on the database included the updated ones', async () => {
    const findAllLocations = await locationService.getLocations()
    assert.lengthOf(findAllLocations, 6)
    assert.include(findAllLocations[5].location_name, locationMock[2].location_name)
  })
})
