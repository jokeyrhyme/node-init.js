'use strict'

const pify = require('pify')

const fs = pify(require('graceful-fs'), {
  exclude: [ /Stream$/ ]
})

module.exports = fs

module.exports.touch = function touch (filePath) {
  return fs.access(filePath)
    .catch(() => fs.writeFile(filePath, ''))
}
