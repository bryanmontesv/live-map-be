'use strict'

// const locationService = require('../services/location')

module.exports = {
  async getLocations () {
    try {
      return await "All locations :)"
    } catch (error) {
      return error
    }
  },
  async storeLocations () {
    try {
      return await "stored locations :)"
    } catch (error) {
      return error
    }
  }
}