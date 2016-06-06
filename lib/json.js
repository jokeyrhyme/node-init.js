'use strict'

const loadJson = require('load-json-file')
const writeJson = require('write-json-file')

const JSON_OPTIONS = {
    indent: 2
}

function updateJson (filePath, updater) {
    return loadJson(filePath)
        .catch(() => ({})) // no file? default to new Object
        .then((obj) => updater(obj))
        .then((result) => writeJson(filePath, result, JSON_OPTIONS))
}

module.exports = {
    updateJson
}
