/* @flow */
'use strict'

const path = require('path')

const execa = require('execa')
const updateJsonFile = require('update-json-file')

const { GIT_REPO, JSON_OPTIONS, PACKAGE_JSON } = require('../values.js')

const LABEL = 'npm package.json initialised'

/* :: import type { TaskOptions } from '../types.js' */

function fn ({ cwd } /* : TaskOptions */) {
  return execa('npm', ['init', '-y'], { cwd })
    .then(() => updateJsonFile(path.join(cwd, 'package.json'), (pkg) => {
      // https://github.com/jokeyrhyme/node-init.js/issues/96
      pkg.dependencies = pkg.dependencies || {}
      return pkg
    }, JSON_OPTIONS))
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  provides: [ PACKAGE_JSON ],
  requires: [ GIT_REPO ]
}
