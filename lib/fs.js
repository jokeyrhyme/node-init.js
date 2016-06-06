'use strict'

const pify = require('pify')

module.exports = pify(require('graceful-fs'), {
  exclude: [ /Stream$/ ]
})
