/* @flow */
'use strict'

const path = require('path')

const execa = require('execa')

const { touch } = require('../fs.js')
const { updateJson } = require('../json.js')
const { getPkg } = require('../pkg.js')

const LABEL = 'flowtype installed and configured'

function npmInstall (cwd) {
  return getPkg(cwd)
    .then(({ devDependencies }) => {
      const devDeps = Object.keys(devDependencies || {})
      if (!devDeps.includes('flow-bin')) {
        return execa('npm', [
          'install', '--save-dev', 'flow-bin'
        ], { cwd })
      }
    })
}

function npmScript (cwd) {
  return updateJson(path.join(cwd, 'package.json'), (pkg) => {
    pkg.scripts = pkg.scripts || {}
    pkg.scripts.flow_check = 'flow check || exit 0'
    return pkg
  })
}

/* :: import type { TaskOptions } from '../index.js' */

function fn ({ cwd } /* : TaskOptions */) {
  return npmInstall(cwd)
    .then(() => Promise.all([
      npmScript(cwd),
      touch(path.join(cwd, '.flowconfig'))
    ]))
}

module.exports = {
  fn,
  label: LABEL
}
