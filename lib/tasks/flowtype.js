/* @flow */
'use strict'

const path = require('path')

const execa = require('execa')
const fetch = require('node-fetch')
const updateJsonFile = require('update-json-file')

const fs = require('../fs.js')
const { getPkg } = require('../pkg.js')
const { PACKAGE_JSON, PACKAGE_JSON_DEVDEPS } = require('../values.js')

const LABEL = 'flowtype installed and configured'

function npmInstall (cwd /* : string */) {
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

function npmScript (cwd /* : string */) {
  return updateJsonFile(path.join(cwd, 'package.json'), (pkg) => {
    pkg.scripts = pkg.scripts || {}
    pkg.scripts.flow_check = 'flow check'
    return pkg
  })
}

const CONFIG_URL = 'https://raw.githubusercontent.com/jokeyrhyme/node-init.js/master/.flowconfig'

/* :: import type { TaskOptions } from '../types.js' */

function fetchConfig (cwd /* : string */) {
  const filePath = path.join(cwd, '.flowconfig')
  return fetch(CONFIG_URL)
    .then((res) => res.text())
    .then((data) => fs.writeFile(filePath, data))
}

function fn ({ cwd } /* : TaskOptions */) {
  return Promise.all([
    fetchConfig(cwd),
    npmInstall(cwd)
      .then(() => npmScript(cwd))
  ])
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  provides: [ PACKAGE_JSON_DEVDEPS ],
  requires: [ PACKAGE_JSON ]
}
