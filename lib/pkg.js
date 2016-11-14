/* @flow */
'use strict'

const path = require('path')

const loadJson = require('load-json-file')

const MATCH_SCOPE_REGEXP = /^@(\w[\w_.-]*)\//
const SCOPED_REGEXP = /^@(\w[\w_.-]*)\/(\w[\w_.-]*)$/

/* :: import type { PackageJSON, PackageJSONDependencies } from './types.js' */

function getPkg (cwd /* : string */) /* : Promise<PackageJSON> */ {
  return loadJson(path.join(cwd, 'package.json'))
    .catch(() => ({})) // no file? default to new Object
}

function getScope (cwd /* : string */, scope /* : string */) {
  if (scope) {
    return Promise.resolve(scope.replace(/@/g, ''))
  }
  return getPkg(cwd)
    .then((pkg) => {
      if (!pkg.name || typeof pkg.name !== 'string') {
        return ''
      }
      if (!SCOPED_REGEXP.test(pkg.name)) {
        return ''
      }
      const [ , pkgScope ] = pkg.name.match(MATCH_SCOPE_REGEXP) || []
      return pkgScope
    })
}

function injectScope (scope /* : string */, name /* : string */) {
  const [ , currentScope, currentName ] = name.match(SCOPED_REGEXP) || []
  if (currentScope && currentName) {
    if (scope && scope !== currentScope) {
      return `@${scope}/${currentName}`
    }
    return name
  }
  if (scope) {
    return `@${scope}/${name}`
  }
  return name
}

function isReactProject (
  { dependencies = {}, devDependencies = {}, peerDependencies = {} } /* : PackageJSON */
) /* : boolean */ {
  return !!(
    dependencies.react ||
    devDependencies.react ||
    devDependencies['react-scripts'] ||
    peerDependencies.react
  )
}

module.exports = {
  getPkg,
  getScope,
  injectScope,
  isReactProject
}
