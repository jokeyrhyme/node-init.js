/* @flow */
'use strict';

const path = require('path');
const updateJsonFile = require('update-json-file');

const { JSON_OPTIONS, PACKAGE_JSON } = require('../values.js');

const LABEL = '"publishConfig" for @scope (if any) set in package.json';

/* :: import type { TaskOptions } from '../types.js' */

async function packageJSON(cwd /* : string */) {
  await updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      pkg.publishConfig = pkg.publishConfig || {};
      pkg.publishConfig.access = pkg.publishConfig.access || 'public';
      return pkg;
    },
    JSON_OPTIONS,
  );
}

async function fn({ cwd, scope } /* : TaskOptions */) {
  if (!scope) {
    return;
  }
  await packageJSON(cwd);
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  lib: { packageJSON },
  requires: [PACKAGE_JSON],
};
