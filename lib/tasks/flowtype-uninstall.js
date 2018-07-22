/* @flow */
'use strict';

const path = require('path');

const pify = require('pify');
const rimraf = require('rimraf');

const { PACKAGE_JSON } = require('../values.js');

const LABEL = 'unused FlowType de-configured';

/* :: import type { TaskOptions } from '../types.js' */

function deleteConfig(cwd /* : string */) {
  const filePath = path.join(cwd, '.flowconfig');
  return pify(rimraf)(filePath, { disableGlob: true });
}

function deleteFlowTyped(cwd /* : string */) {
  const filePath = path.join(cwd, 'flow-typed');
  return pify(rimraf)(filePath, { disableGlob: true });
}

function fn({ cwd } /* : TaskOptions */) {
  return Promise.all([deleteConfig(cwd), deleteFlowTyped(cwd)]);
}

function isNeeded({ isFlowProject } /* : TaskOptions */) {
  return !isFlowProject;
}

module.exports = {
  fn,
  id:       path.basename(__filename),
  isNeeded,
  label:    LABEL,
  requires: [PACKAGE_JSON],
};
