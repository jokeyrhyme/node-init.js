/* @flow */
'use strict';

const path = require('path');

const updateJsonFile = require('update-json-file');

const { copyFile } = require('../fs.js');
const { addScript } = require('../pkg.js');
const { JSON_OPTIONS, PACKAGE_JSON } = require('../values.js');

/* :: import type { TaskOptions } from '../types.js' */

const LABEL = 'FlowType installed and configured';

const SKELETON_FLOWCONFIG_PATH = path.join(
  __dirname,
  '..',
  'skeleton',
  '.flowconfig',
);

function npmScript(cwd /* : string */) {
  return updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      pkg.scripts = pkg.scripts || {};

      pkg.scripts.flow = `flow check`;
      addScript(pkg, 'test', 'npm run flow');

      return pkg;
    },
    JSON_OPTIONS,
  );
}

function fn({ cwd } /* : TaskOptions */) {
  return Promise.all([
    copyFile(SKELETON_FLOWCONFIG_PATH, path.join(cwd, '.flowconfig')),
    npmScript(cwd),
  ]);
}

function isNeeded({ isFlowProject } /* : TaskOptions */) {
  return isFlowProject;
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  lib: {
    npmScript,
  },
  requires: [PACKAGE_JSON],
};
