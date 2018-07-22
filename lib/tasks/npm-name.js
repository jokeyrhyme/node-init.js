/* @flow */
'use strict';

const path = require('path');

const updateJsonFile = require('update-json-file');

const { injectScope } = require('../pkg.js');
const {
  JSON_OPTIONS,
  PACKAGE_JSON,
  PACKAGE_JSON_NAME,
} = require('../values.js');

const LABEL = '"name" with optional @scope set in package.json';

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd, scope } /* : TaskOptions */) {
  return updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      pkg.name = injectScope(scope, pkg.name);
      return pkg;
    },
    JSON_OPTIONS,
  );
}

module.exports = {
  fn,
  id:       path.basename(__filename),
  label:    LABEL,
  provides: [PACKAGE_JSON_NAME],
  requires: [PACKAGE_JSON],
};
