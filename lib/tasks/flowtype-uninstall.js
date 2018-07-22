/* @flow */
'use strict';

const path = require('path');

const pify = require('pify');
const rimraf = require('rimraf');
const updateJsonFile = require('update-json-file');

const { removeScript } = require('../pkg.js');
const { JSON_OPTIONS, PACKAGE_JSON } = require('../values.js');

const LABEL = 'unused FlowType uninstalled and configured';

function npmScript(cwd /* : string */) {
  return updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      pkg.scripts = pkg.scripts || {};

      for (const script of ['pretest', 'test', 'posttest']) {
        removeScript(pkg, script, 'npm run flow');
        removeScript(pkg, script, 'npm run flow_check');
      }

      delete pkg.scripts.flow;
      delete pkg.scripts.flow_check;

      return pkg;
    },
    JSON_OPTIONS,
  );
}

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
  return Promise.all([deleteConfig(cwd), deleteFlowTyped(cwd), npmScript(cwd)]);
}

function isNeeded({ isFlowProject } /* : TaskOptions */) {
  return !isFlowProject;
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  requires: [PACKAGE_JSON],
};
