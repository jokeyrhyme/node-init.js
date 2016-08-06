/* @flow */
'use strict'

const without = require('lodash.without')

function ensureArrayHead (array /* : Array<any> */, value /* : any */) {
  return [ value, ...without(array, value) ]
}

module.exports = { ensureArrayHead }
