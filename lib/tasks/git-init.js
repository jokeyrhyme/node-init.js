/* @flow */
'use strict';

const path = require('path');

const { init, isGitProject } = require('../git.js');
const { GIT_REPO } = require('../values.js');

const LABEL = 'git project exists';

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  return init(cwd);
}

function isNeeded({ cwd } /* : TaskOptions */) {
  return isGitProject(cwd).then(result => !result);
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  provides: [GIT_REPO],
};
