/* @flow */
'use strict'

const path = require('path')

const { filterByIsAccess } = require('../fs.js')
const { ensureArrayHead } = require('../data.js')
const { updateJson } = require('../json.js')

const LABEL = 'ESLint configured'

function eslintrc (cwd) {
  const rcPath = path.join(cwd, '.eslintrc')
  const jsonPath = path.join(cwd, '.eslintrc.json')
  return filterByIsAccess([ rcPath, jsonPath ])
    .then(([ cfgPath = jsonPath ]) => updateJson(cfgPath, (rc) => {
      rc.extends = rc.extends || []
      if (!Array.isArray(rc.extends)) {
        rc.extends = rc.extends || [ rc.extends ]
      }
      if (!rc.extends.includes('semistandard')) {
        rc.extends = ensureArrayHead(rc.extends, 'standard')
      }
      rc.extends = ensureArrayHead(rc.extends, 'eslint:recommended')
      return rc
    }))
}

/* :: import type { TaskOptions } from '../index.js' */

function fn ({ cwd } /* : TaskOptions */) {
  return eslintrc(cwd)
}

module.exports = {
  fn,
  label: LABEL
}
