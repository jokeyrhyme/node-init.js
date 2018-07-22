/* @flow */
'use strict';

const path = require('path');

const { PACKAGE_JSON } = require('../values.js');

const LABEL = '`npm install` deps. and devDeps.';

/* :: import type { TaskOptions } from '../types.js' */

async function fn({ cwd } /* : TaskOptions */) {
  return cwd;
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  requires: [PACKAGE_JSON],
};
