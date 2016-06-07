'use strict'

const path = require('path')

const loadJson = require('load-json-file')

const MATCH_SCOPE_REGEXP = /^@(\w[\w_\.-]*)\//
const SCOPED_REGEXP = /^@(\w[\w_\.-]*)\/(\w[\w_\.-]*)$/

function getPkg (cwd) {
  return loadJson(path.join(cwd, 'package.json'))
    .catch(() => ({})) // no file? default to new Object
}

function getScope (cwd, scope) {
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

function injectScope (scope, name) {
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

module.exports = {
  getPkg,
  getScope,
  injectScope
}
