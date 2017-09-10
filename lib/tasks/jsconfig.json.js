/* @flow */
'use strict';

const path = require('path');

const union = require('lodash.union');
const updateJsonFile = require('update-json-file');

const { JSON_OPTIONS } = require('../values.js');

const LABEL = 'jsconfig.json configured';

function jsconfig(cwd) {
  return updateJsonFile(
    path.join(cwd, 'jsconfig.json'),
    rc => {
      rc.compilerOptions = rc.compilerOptions || {};
      rc.compilerOptions.target = rc.compilerOptions.target || 'ES6';
      rc.compilerOptions.allowSyntheticDefaultImports =
        rc.compilerOptions.allowSyntheticDefaultImports || true;

      rc.exclude = rc.exclude || [];
      rc.exclude = union(rc.exclude, ['node_modules']);

      return rc;
    },
    JSON_OPTIONS
  );
}

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  return jsconfig(cwd);
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
};
