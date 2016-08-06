/* @flow */
'use strict'

const loadJson = require('load-json-file')
const writeJson = require('write-json-file')

const JSON_OPTIONS = {
  indent: 2
}

/* ::
declare type JSONUpdater = (obj: Object) => Promise<Object>
*/

function updateJson (filePath /* : string */, updater /* : JSONUpdater */) {
  return loadJson(filePath)
        .catch(() => ({})) // no file? default to new Object
        .then((obj) => updater(obj))
        .then((result) => writeJson(filePath, result, JSON_OPTIONS))
}

module.exports = {
  updateJson
}
