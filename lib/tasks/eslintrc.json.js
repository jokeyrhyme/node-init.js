'use strict'

const path = require('path')

const { ensureArrayHead } = require('../data.js')
const { updateJson } = require('../json.js')

const LABEL = 'ESLint configured'

function eslintrc (cwd) {
  return updateJson(path.join(cwd, '.eslintrc.json'), (rc) => {
    rc.extends = rc.extends || []
    if (!Array.isArray(rc.extends)) {
      rc.extends = rc.extends || [ rc.extends ]
    }
    if (!rc.extends.includes('semistandard')) {
      rc.extends = ensureArrayHead(rc.extends, 'standard')
    }
    rc.extends = ensureArrayHead(rc.extends, 'eslint:recommended')
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
