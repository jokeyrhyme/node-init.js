/* @flow */
'use strict';

const path = require('path');

const execa = require('execa');
const intersection = require('lodash.intersection');
const readPkgUp = require('read-pkg-up');

const { PACKAGE_JSON } = require('../values.js');

const LABEL = 'npm packages uninstalled';

/* :: import type { TaskOptions } from '../types.js' */

async function fn({ cwd } /* : TaskOptions */) {
  const { pkg } = await readPkgUp({ cwd });

  const pkgs = [
    'fixpack', // use sort-package-json now instead
    'prettier', // run this via npx instead of as a devDep
  ];

  const deps = intersection(pkgs, Object.keys(pkg.dependencies || {}));
  if (deps.length) {
    await execa('npm', ['uninstall', '--save', ...deps], { cwd });
  }

  const devDeps = intersection(pkgs, Object.keys(pkg.devDependencies || {}));
  if (devDeps.length) {
    await execa('npm', ['uninstall', '--save-dev', ...devDeps], { cwd });
  }
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  requires: [PACKAGE_JSON],
};
