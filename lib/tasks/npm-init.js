/* @flow */
'use strict'

const path = require('path')

const execa = require('execa')

const LABEL = 'npm package.json initialised'

/* :: import type { TaskOptions } from '../types.js' */

function fn ({ cwd } /* : TaskOptions */) {
  return execa('npm', ['init', '-y'], { cwd })
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL
}
