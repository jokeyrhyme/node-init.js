/* @flow */
'use strict'

const execa = require('execa')

const LABEL = 'npm package.json initialised'

/* :: import type { TaskOptions } from '../types.js' */

function fn ({ cwd } /* : TaskOptions */) {
  return execa('npm', ['init', '-y'], { cwd })
}

module.exports = {
  fn,
  label: LABEL
}
