'use strict'

const path = require('path')

const { updateJson } = require('../json.js')
const { injectScope } = require('../scope.js')

const LABEL = '"name" with optional @scope set in package.json'

function fn ({ cwd, scope }) {
  return updateJson(
    path.join(cwd, 'package.json'),
    (pkg) => {
      pkg.name = injectScope(scope, pkg.name)
      return pkg
    }
  )
}

module.exports = {
  fn,
  label: LABEL
}
