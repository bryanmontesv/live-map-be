'use strict'

const locationService = require('../services/location')
const Boom = require('boom')

module.exports = {
  async getLocations () {
    try {
      return await locationService.getLocations('hello locations')
    } catch (error) {
      return Boom.failedDependency(error)
    }
  },
  async storeLocations () {
    try {
      return await locationService.getLocations('hello locations inserted')
    } catch (error) {
      return Boom.badRequest(error)
    }
  }
}
