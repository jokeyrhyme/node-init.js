/* @flow */
'use strict';

const path = require('path');

const execa = require('execa');

const { PACKAGE_JSON } = require('../values.js');

const LABEL = 'npm packages uninstalled';

/* :: import type { TaskOptions } from '../types.js' */

async function fn({ cwd } /* : TaskOptions */) {
  const pkgs = ['fixpack'];
  await execa('npm', ['uninstall', ...pkgs], { cwd });
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  requires: [PACKAGE_JSON],
};
