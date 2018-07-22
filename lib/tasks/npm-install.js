/* @flow */
'use strict';

const path = require('path');

const execa = require('execa');
const without = require('lodash.without');
const readPkgUp = require('read-pkg-up');

const {
  hasTestFramework,
  isReactProject,
  isTestScriptUnconfigured,
} = require('../pkg.js');
const { PACKAGE_JSON } = require('../values.js');

const LABEL = '`npm install` deps. and devDeps.';

/* :: import type { TaskOptions } from '../types.js' */

async function fn({ cwd, isFlowProject } /* : TaskOptions */) {
  const { pkg } = await readPkgUp({ cwd });

  const pkgs = [
    'eslint',
    'eslint-plugin-import',
    'eslint-plugin-node',
    'eslint-plugin-promise',
  ];
  if (isFlowProject) {
    pkgs.push('flow-bin');
  }
  if (isReactProject(pkg)) {
    pkgs.push('eslint-plugin-react');
  }
  if (!hasTestFramework(pkg) && isTestScriptUnconfigured(pkg)) {
    pkgs.push('jest');
  }
  const devDeps = without(pkgs, ...Object.keys(pkg.devDependencies || {}));
  if (devDeps.length) {
    await execa('npm', ['install', '--save-dev', ...devDeps], { cwd });
  }
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  requires: [PACKAGE_JSON],
};
