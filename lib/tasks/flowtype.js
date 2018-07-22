/* @flow */
'use strict';

const path = require('path');

const { copyFile } = require('../fs.js');
const { PACKAGE_JSON } = require('../values.js');

/* :: import type { TaskOptions } from '../types.js' */

const LABEL = 'FlowType configured';

const SKELETON_FLOWCONFIG_PATH = path.join(
  __dirname,
  '..',
  'skeleton',
  '.flowconfig',
);

async function fn({ cwd } /* : TaskOptions */) {
  await copyFile(SKELETON_FLOWCONFIG_PATH, path.join(cwd, '.flowconfig'));
}

function isNeeded({ isFlowProject } /* : TaskOptions */) {
  return isFlowProject;
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  requires: [PACKAGE_JSON],
};
