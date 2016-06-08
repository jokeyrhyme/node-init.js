'use strict'

const path = require('path')

const union = require('lodash.union')

const { updateJson } = require('../json.js')

const LABEL = 'jsconfig.json configured'

function jsconfig (cwd) {
  return updateJson(path.join(cwd, 'jsconfig.json'), (rc) => {
    rc.compilerOptions = rc.compilerOptions || {}
    rc.compilerOptions.target = rc.compilerOptions.target || 'ES6'
    rc.compilerOptions.allowSyntheticDefaultImports = rc.compilerOptions.allowSyntheticDefaultImports || true

    rc.exclude = rc.exclude || []
    rc.exclude = union(rc.exclude, [ 'node_modules' ])

    return rc
  })
}

function fn ({ cwd }) {
  return jsconfig(cwd)
}

module.exports = {
  fn,
  label: LABEL
}
