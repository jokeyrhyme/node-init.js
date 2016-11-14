/* @flow */
'use strict'

const path = require('path')

const execa = require('execa')

const fs = require('../fs.js')
const { GIT_REPO } = require('../values.js')

const LABEL = 'git project exists'

/* :: import type { TaskOptions } from '../types.js' */

function fn ({ cwd } /* : TaskOptions */) {
  return fs.access(path.join(cwd, '.git'))
        .catch(() => execa('git', ['init'], { cwd }))
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  provides: [ GIT_REPO ]
}
