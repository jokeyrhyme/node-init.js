/* @flow */
'use strict';

const path = require('path');
const updateJsonFile = require('update-json-file');

const { addScript, getPkg } = require('../pkg.js');
const { JSON_OPTIONS, PACKAGE_JSON } = require('../values.js');

const LABEL = 'ava found and configured';

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  return updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      const devDeps = pkg.devDependencies || {};
      if (devDeps.ava) {
        addScript(pkg, 'ava', 'ava');

        if (devDeps.nyc) {
          pkg.scripts = Object.assign({}, pkg.scripts, {
            ava: 'nyc ava',
            nyc: 'nyc check-coverage'
          });
        }
      }

      return pkg;
    },
    JSON_OPTIONS
  );
}

function isNeeded({ cwd } /* : TaskOptions */) {
  return getPkg(cwd).then(pkg => !!(pkg.devDependencies || {}).ava);
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  requires: [PACKAGE_JSON]
};
