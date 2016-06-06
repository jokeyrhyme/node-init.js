'use strict'

const path = require('path')

const execa = require('execa')

const updateJson = require('../json.js').updateJson

const LABEL = 'ESLint installed and configured'

function eslintrc (cwd) {
  return updateJson(path.join(cwd, '.eslintrc.json'), (rc) => {
    rc.extends = rc.extends || []
    if (!Array.isArray(rc.extends)) {
      rc.extends = rc.extends || [ rc.extends ]
    }
    if (!rc.extends.includes('standard')) {
      rc.extends.unshift('standard')
    }
    if (!rc.extends.includes('eslint:recommended')) {
      rc.extends.unshift('eslint:recommended')
    }
    return rc
  })
}

function npmInstall (cwd) {
  return execa('npm', [
    'install', '--save-dev',
    'eslint',
    'eslint-config-standard',
    'eslint-plugin-promise',
    'eslint-plugin-standard'
  ], { cwd })
}

function npmScript (cwd) {
  return updateJson(path.join(cwd, 'package.json'), (pkg) => {
    pkg.scripts = pkg.scripts = {}
    pkg.scripts.eslint = 'eslint --fix --cache .'
    return pkg
  })
}

function fn ({ cwd }) {
  return Promise.all([
    eslintrc(cwd),
    npmInstall(cwd)
  ])
        .then(() => npmScript(cwd))
}

module.exports = {
  fn,
  label: LABEL
}
