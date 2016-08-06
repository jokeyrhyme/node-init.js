/* @flow */
'use strict'

const pify = require('pify')

const fs = pify(require('graceful-fs'), {
  exclude: [ /Stream$/ ]
})

module.exports = fs

// like fs.access, but results in a boolean (no error)
module.exports.isAccess = function isAccess (filePath) {
  return fs.access(filePath)
    .then(() => true)
    .catch(() => false)
}

// given an array of paths, result is an array of accessible paths
module.exports.filterByIsAccess = function filterByIsAccess (filePaths) {
  return Promise.all(filePaths.map(module.exports.isAccess))
    .then((results) => filePaths.filter((filePath, index) => {
      return results[index]
    }))
}

module.exports.touch = function touch (filePath) {
  return fs.access(filePath)
    .catch(() => fs.writeFile(filePath, ''))
}
