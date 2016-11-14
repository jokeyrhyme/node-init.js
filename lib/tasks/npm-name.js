/* @flow */
'use strict'

const path = require('path')

const { updateJson } = require('../json.js')
const { injectScope } = require('../pkg.js')

const LABEL = '"name" with optional @scope set in package.json'

/* :: import type { TaskOptions } from '../types.js' */

function fn ({ cwd, scope } /* : TaskOptions */) {
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
