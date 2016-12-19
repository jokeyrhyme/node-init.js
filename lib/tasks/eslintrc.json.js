/* @flow */
'use strict'

const path = require('path')

const { mkdir } = require('idempotent-fs')
const locatePath = require('locate-path')
const union = require('lodash.union')

const { ensureArrayHead } = require('../data.js')
const { updateJson } = require('../json.js')
const { getPkg, isReactProject } = require('../pkg.js')
const { PACKAGE_JSON } = require('../values.js')

const LABEL = 'ESLint configured'

function eslintrc (cwd) {
  const rcPaths = [
    path.join(cwd, '.eslintrc'),
    path.join(cwd, '.eslintrc.json')
  ]
  const testRcPaths = [
    path.join(cwd, 'test', '.eslintrc'),
    path.join(cwd, 'test', '.eslintrc.json')
  ]
  let hasReact = false
  return getPkg(cwd)
    .then((pkg) => {
      hasReact = isReactProject(pkg)
    })
    .then(() => locatePath(rcPaths))
    .then((cfgPath = rcPaths[1]) => updateJson(cfgPath, (rc) => {
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
      rc.extends = ensureArrayHead(rc.extends, 'plugin:node/recommended')
      rc.extends = ensureArrayHead(rc.extends, 'eslint:recommended')

      rc.plugins = rc.plugins || []
      rc.plugins = union(rc.plugins, [ 'node' ])

      return rc
    }))
    .then(() => mkdir(path.join(cwd, 'test')))
    .then(() => locatePath(testRcPaths))
    .then((cfgPath = testRcPaths[1]) => updateJson(cfgPath, (rc) => {
      rc.extends = rc.extends || []
      if (!Array.isArray(rc.extends)) {
        rc.extends = rc.extends || [ rc.extends ]
      }
      rc.extends = ensureArrayHead(rc.extends, path.join('..', path.basename(cfgPath)))

      rc.rules = rc.rules || {}
      // https://github.com/mysticatea/eslint-plugin-node/issues/47
      rc.rules['node/no-unpublished-require'] = 0

      return rc
    }))
}

/* :: import type { TaskOptions } from '../types.js' */

function fn ({ cwd } /* : TaskOptions */) {
  return eslintrc(cwd)
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  requires: [ PACKAGE_JSON ]
}
