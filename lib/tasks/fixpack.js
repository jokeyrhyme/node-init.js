/* @flow */
'use strict'

const path = require('path')

const execa = require('execa')
const updateJsonFile = require('update-json-file')

const { addScript, removeScript } = require('../pkg.js')
const {
  JSON_OPTIONS, PACKAGE_JSON, PACKAGE_JSON_DEVDEPS
} = require('../values.js')

const LABEL = 'fixpack installed and configured'

function npmInstall (cwd) {
  return execa('npm', [
    'install', '--save-dev',
    'fixpack'
  ], { cwd })
}

function npmScript (cwd) {
  return updateJsonFile(path.join(cwd, 'package.json'), (pkg) => {
    pkg.scripts = pkg.scripts || {}
    pkg.scripts.fixpack = 'fixpack'

    addScript(pkg, 'pretest', 'npm run fixpack')
    removeScript(pkg, 'posttest', 'npm run fixpack')

    return pkg
  }, JSON_OPTIONS)
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
  provides: [ PACKAGE_JSON_DEVDEPS ],
  settles: [ PACKAGE_JSON ]
}
