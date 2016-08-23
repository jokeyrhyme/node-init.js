/* @flow */
'use strict'

const path = require('path')

const { filterByIsAccess } = require('../fs.js')
const { ensureArrayHead } = require('../data.js')
const { updateJson } = require('../json.js')
const { getPkg, isReactProject } = require('../pkg.js')

const LABEL = 'ESLint configured'

function eslintrc (cwd) {
  const rcPath = path.join(cwd, '.eslintrc')
  const jsonPath = path.join(cwd, '.eslintrc.json')
  let hasReact = false
  return getPkg(cwd)
    .then((pkg) => {
      hasReact = isReactProject(pkg)
    })
    .then(() => filterByIsAccess([ rcPath, jsonPath ]))
    .then(([ cfgPath = jsonPath ]) => updateJson(cfgPath, (rc) => {
      rc.extends = rc.extends || []
      if (!Array.isArray(rc.extends)) {
        rc.extends = rc.extends || [ rc.extends ]
      }
      if (hasReact && !rc.extends.includes('standard-react')) {
        rc.extends = ensureArrayHead(rc.extends, 'standard-react')
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
