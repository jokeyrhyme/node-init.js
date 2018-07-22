/* @flow */
'use strict';

const path = require('path');

const execa = require('execa');
const without = require('lodash.without');
const readPkgUp = require('read-pkg-up');

const { PACKAGE_JSON } = require('../values.js');

const LABEL = '`npm install` deps. and devDeps.';

/* :: import type { TaskOptions } from '../types.js' */

async function fn({ cwd, isFlowProject } /* : TaskOptions */) {
  const { pkg } = await readPkgUp({ cwd });

  const pkgs = [];
  if (isFlowProject) {
    pkgs.push('flow-bin');
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
