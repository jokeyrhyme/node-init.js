'use strict'

const path = require('path')

const fetch = require('node-fetch')

const fs = require('../fs.js')

const LABEL = '.editorconfig initialised'

const STANDARD_URL = 'https://raw.githubusercontent.com/jokeyrhyme/standard-editorconfig/master/.editorconfig'

function fn ({ cwd }) {
  const filePath = path.join(cwd, '.editorconfig')
  return fetch(STANDARD_URL)
    .then((res) => res.text())
    .then((data) => fs.writeFile(filePath, data))
}

module.exports = {
  fn,
  label: LABEL
}
