/* @flow */
'use strict'

const path = require('path')

const execa = require('execa')
const updateJsonFile = require('update-json-file')

const { addScript } = require('../pkg.js')
const {
  JSON_OPTIONS, PACKAGE_JSON, PACKAGE_JSON_DEVDEPS
} = require('../values.js')

const LABEL = 'prettier installed and configured'

function npmInstall(cwd) {
  return execa('npm', [
    'install', '--save-dev',
    'prettier'
  ], { cwd })
}

function npmScript(cwd) {
  return updateJsonFile(path.join(cwd, 'package.json'), (pkg) => {
    pkg.scripts = pkg.scripts || {}
    pkg.scripts.prettier = 'prettier --single-quote --write "{,!(build|coverage|dist|node_modules)/**/}*.js"'

    addScript(pkg, 'pretest', 'npm run prettier')

    return pkg
  }, JSON_OPTIONS)
}

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  return npmInstall(cwd)
    .then(() => npmScript(cwd))
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  provides: [PACKAGE_JSON_DEVDEPS],
  requires: [PACKAGE_JSON]
}
