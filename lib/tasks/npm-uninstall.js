/* @flow */
'use strict';

const path = require('path');

const execa = require('execa');

const { PACKAGE_JSON } = require('../values.js');

const LABEL = 'npm packages uninstalled';

/* :: import type { TaskOptions } from '../types.js' */

async function fn({ cwd } /* : TaskOptions */) {
  const pkgs = [
    'fixpack', // use sort-package-json now instead
    'prettier', // run this via npx instead of as a devDep
  ];
  await execa('npm', ['uninstall', '--save', ...pkgs], { cwd });
  await execa('npm', ['uninstall', '--save-dev', ...pkgs], { cwd });
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  requires: [PACKAGE_JSON],
};
