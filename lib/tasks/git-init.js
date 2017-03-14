/* @flow */
'use strict'

const path = require('path')

const git = require('../git.js')
const { GIT_REPO } = require('../values.js')

const LABEL = 'git project exists'

/* :: import type { TaskOptions } from '../types.js' */

function fn ({ cwd } /* : TaskOptions */) {
  return git.init(cwd)
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  provides: [ GIT_REPO ]
}
