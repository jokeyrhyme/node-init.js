/* @flow */
'use strict'

const fs = require('@jokeyrhyme/pify-fs')

module.exports = fs

module.exports.touch = function touch (filePath) {
  return fs.access(filePath)
    .catch(() => fs.writeFile(filePath, ''))
}
