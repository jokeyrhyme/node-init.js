'use strict'

const without = require('lodash.without')

function ensureArrayHead (array, value) {
  return [ value, ...without(array, value) ]
}

module.exports = { ensureArrayHead }
