/* @flow */
'use strict'

const path = require('path')

const execa = require('execa')
const updateJsonFile = require('update-json-file')

const { getPkg, isReactProject } = require('../pkg.js')
const {
  JSON_OPTIONS, PACKAGE_JSON, PACKAGE_JSON_DEVDEPS
} = require('../values.js')

const LABEL = 'ESLint installed and configured'

const ESLINT_PACKAGES = [
  'eslint',
  'eslint-config-standard',
  'eslint-plugin-import',
  'eslint-plugin-node',
  'eslint-plugin-promise',
  'eslint-plugin-standard'
]

const ESLINT_REACT_PACKAGES = [
  'eslint-config-standard-react',
  'eslint-plugin-react'
]

function npmInstall (cwd) {
  return getPkg(cwd)
    .then((pkg) => {
      let packages = [].concat(ESLINT_PACKAGES)
      if (isReactProject(pkg)) {
        packages = packages.concat(ESLINT_REACT_PACKAGES)
      }
      const devDeps = Object.keys(pkg.devDependencies || {})
      if (!packages.every((name) => devDeps.includes(name))) {
        return execa('npm', [
          'install', '--save-dev',
          ...packages
        ], { cwd })
      }
    })
}

function npmScript (cwd) {
  return updateJsonFile(path.join(cwd, 'package.json'), (pkg) => {
    pkg.scripts = pkg.scripts || {}
    pkg.scripts.eslint = 'eslint --fix --cache .'
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
  requires: [ PACKAGE_JSON ]
}
