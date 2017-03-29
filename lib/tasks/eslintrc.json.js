/* @flow */
'use strict'

const path = require('path')

const { mkdir } = require('idempotent-fs')
const locatePath = require('locate-path')
const union = require('lodash.union')
const updateJsonFile = require('update-json-file')

const { ensureArrayHead } = require('../data.js')
const { getPkg, isReactProject } = require('../pkg.js')
const { JSON_OPTIONS, PACKAGE_JSON } = require('../values.js')

const LABEL = 'ESLint configured'

function isNotExplicitInheritance (extend /* : any */) {
  // e.g. [ '../.eslintrc.json' ]
  return typeof extend === 'string' && extend.indexOf('../') !== 0
}

/* ::
type Options = {
  hasReact: boolean
}
*/

function eslintrcUpdater (
  rc /* : Object */,
  { hasReact } /* : Options */
) {
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
}

function testEslintrcUpdater (
  rc /* : Object */,
  { hasReact } /* : Options */
) {
  rc.extends = rc.extends || []
  if (!Array.isArray(rc.extends)) {
    rc.extends = rc.extends || [ rc.extends ]
  }

  // no explicit inheritance / extends
  rc.extends = rc.extends.filter(isNotExplicitInheritance)
  if (!rc.extends.length) {
    delete rc.extends
  }

  rc.rules = rc.rules || {}
  // https://github.com/mysticatea/eslint-plugin-node/issues/47
  rc.rules['node/no-unpublished-require'] = 0

  return rc
}

function eslintrc (cwd) {
  const rcPaths = [
    path.join(cwd, '.eslintrc'),
    path.join(cwd, '.eslintrc.json')
  ]
  const testRcPaths = [
    path.join(cwd, 'test', '.eslintrc'),
    path.join(cwd, 'test', '.eslintrc.json'),
    path.join(cwd, 'tests', '.eslintrc'),
    path.join(cwd, 'tests', '.eslintrc.json'),
    path.join(cwd, '__tests__', '.eslintrc'),
    path.join(cwd, '__tests__', '.eslintrc.json')
  ]
  let hasReact = false
  return getPkg(cwd)
    .then((pkg) => {
      hasReact = isReactProject(pkg)
    })
    .then(() => locatePath(rcPaths))
    .then((cfgPath = rcPaths[1]) => updateJsonFile(
      cfgPath,
      (rc) => eslintrcUpdater(rc, { hasReact }),
      JSON_OPTIONS
    ))
    .then(() => mkdir(path.join(cwd, 'test')))
    .then(() => locatePath(testRcPaths))
    .then((cfgPath = testRcPaths[1]) => updateJsonFile(
      cfgPath,
      (rc) => testEslintrcUpdater(rc, { hasReact }),
      JSON_OPTIONS
    ))
}

/* :: import type { TaskOptions } from '../types.js' */

function fn ({ cwd } /* : TaskOptions */) {
  return eslintrc(cwd)
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  lib: {
    eslintrcUpdater,
    testEslintrcUpdater
  },
  requires: [ PACKAGE_JSON ]
}
