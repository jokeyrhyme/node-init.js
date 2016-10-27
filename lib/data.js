/* @flow */
'use strict'

const without = require('lodash.without')

function ensureArrayHead (
  array /* : Array<any> */,
  value /* : any */
) /* : Array<any> */ {
  return [ value, ...without(array, value) ]
}

function ensureArrayTail (
  array /* : Array<any> */,
  value /* : any */
) /* : Array<any> */ {
  return [ ...without(array, value), value ]
}

module.exports = {
  ensureArrayHead,
  ensureArrayTail
}
