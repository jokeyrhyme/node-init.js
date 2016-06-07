'use strict'

const path = require('path')

const { updateJson } = require('../json.js')

const LABEL = 'ESLint configured'

function eslintrc (cwd) {
  return updateJson(path.join(cwd, '.eslintrc.json'), (rc) => {
    rc.extends = rc.extends || []
    if (!Array.isArray(rc.extends)) {
      rc.extends = rc.extends || [ rc.extends ]
    }
    if (!rc.extends.includes('standard')) {
      rc.extends.unshift('standard')
    }
    if (!rc.extends.includes('eslint:recommended')) {
      rc.extends.unshift('eslint:recommended')
    }
    return rc
  })
}

function fn ({ cwd }) {
  return eslintrc(cwd)
}

module.exports = {
  fn,
  label: LABEL
}
