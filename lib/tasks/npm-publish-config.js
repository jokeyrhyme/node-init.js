/* @flow */
'use strict'

const path = require('path')

const { updateJson } = require('../json.js')

const LABEL = '"publishConfig" for @scope (if any) set in package.json'

/* :: import type { TaskOptions } from '../types.js' */

function fn ({ cwd, scope } /* : TaskOptions */) {
  if (!scope) {
    return Promise.resolve()
  }
  return updateJson(
    path.join(cwd, 'package.json'),
    (pkg) => {
      pkg.publishConfig = pkg.publishConfig || {}
      pkg.publishConfig.access = pkg.publishConfig.access || 'public'
      return pkg
    }
  )
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL
}
