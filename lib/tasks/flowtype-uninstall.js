/* @flow */
'use strict'

const path = require('path')

const { hasAnnotatedFiles } = require('detect-flowtype')
const execa = require('execa')
const pify = require('pify')
const rimraf = require('rimraf')
const updateJsonFile = require('update-json-file')

const { removeScript } = require('../pkg.js')
const {
  JSON_OPTIONS, PACKAGE_JSON, PACKAGE_JSON_DEVDEPS, PROJECT_CODE
} = require('../values.js')

const LABEL = 'unused FlowType uninstalled and configured'

function npmUninstall (cwd /* : string */) {
  return execa('npm', [
    'uninstall', '--save-dev', 'flow-bin'
  ], { cwd })
}

function npmScript (cwd /* : string */) {
  return updateJsonFile(path.join(cwd, 'package.json'), (pkg) => {
    pkg.scripts = pkg.scripts || {}
    removeScript(pkg, 'test', 'npm run flow_check')
    removeScript(pkg, 'posttest', 'npm run flow_check')
    removeScript(pkg, 'pretest', 'npm run flow_check')
    delete pkg.scripts.flow_check
    return pkg
  }, JSON_OPTIONS)
}

/* :: import type { TaskOptions } from '../types.js' */

function deleteConfig (cwd /* : string */) {
  const filePath = path.join(cwd, '.flowconfig')
  return pify(rimraf)(filePath, { disableGlob: true })
}

function deleteFlowTyped (cwd /* : string */) {
  const filePath = path.join(cwd, 'flow-typed')
  return pify(rimraf)(filePath, { disableGlob: true })
}

function fn ({ cwd } /* : TaskOptions */) {
  return Promise.all([
    deleteConfig(cwd),
    deleteFlowTyped(cwd),
    npmUninstall(cwd)
      .then(() => npmScript(cwd))
  ])
}

function isNeeded ({ cwd } /* : TaskOptions */) {
  return hasAnnotatedFiles({ dirPath: cwd }).then((result) => !result)
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  provides: [ PACKAGE_JSON_DEVDEPS ],
  requires: [ PACKAGE_JSON, PROJECT_CODE ]
}
