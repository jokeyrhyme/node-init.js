/* @flow */
'use strict';

const path = require('path');

const updateJsonFile = require('update-json-file');

const { addScript } = require('../pkg.js');
const {
  JSON_OPTIONS,
  PACKAGE_JSON,
  PACKAGE_JSON_DEVDEPS,
} = require('../values.js');

const LABEL = 'nsp installed and configured';

function npmScript(cwd) {
  return updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      pkg.scripts = pkg.scripts || {};
      pkg.scripts.nsp = 'npx -q nsp check';

      addScript(pkg, 'test', 'npm run nsp');

      return pkg;
    },
    JSON_OPTIONS,
  );
}

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  return npmScript(cwd);
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  provides: [PACKAGE_JSON_DEVDEPS],
  requires: [PACKAGE_JSON],
};
