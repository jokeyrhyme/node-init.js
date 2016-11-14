/* @flow */
'use strict'

const path = require('path')

const semver = require('semver')

const updateJson = require('../json.js').updateJson
const { PACKAGE_JSON } = require('../values.js')

const LABEL = 'devDeps in package.json permit MINOR and PATCH updates'

/* :: import type { TaskOptions } from '../types.js' */

function fn ({ cwd } /* : TaskOptions */) {
  return updateJson(path.join(cwd, 'package.json'), (pkg) => {
    pkg.devDependencies = pkg.devDependencies || {}
    Object.keys(pkg.devDependencies).forEach((dep) => {
      const version = pkg.devDependencies[dep]
      if (semver.valid(version)) {
        pkg.devDependencies[dep] = version.replace(/^\D*(\d)/, '^$1')
      }
    })
    return pkg
  })
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  requires: [ PACKAGE_JSON ]
}
