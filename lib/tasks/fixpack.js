/* @flow */
'use strict'

const path = require('path')

const execa = require('execa')

const { updateJson } = require('../json.js')
const { getPkg } = require('../pkg.js')
const { PACKAGE_JSON } = require('../values.js')

const LABEL = 'fixpack installed and configured'

function npmInstall (cwd) {
  return getPkg(cwd)
    .then(({ devDependencies }) => {
      const devDeps = Object.keys(devDependencies || {})
      if (!devDeps.includes('fixpack')) {
        return execa('npm', [
          'install', '--save-dev',
          'fixpack'
        ], { cwd })
      }
    })
}

function npmScript (cwd) {
  return updateJson(path.join(cwd, 'package.json'), (pkg) => {
    pkg.scripts = pkg.scripts || {}
    pkg.scripts.fixpack = 'fixpack'
    return pkg
  })
}

/* :: import type { TaskOptions } from '../types.js' */

function fn ({ cwd } /* : TaskOptions */) {
  return npmInstall(cwd)
    .then(() => npmScript(cwd))
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  requires: [ PACKAGE_JSON ]
}
