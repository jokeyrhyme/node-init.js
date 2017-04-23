/* @flow */
'use strict';

const path = require('path');
const updateJsonFile = require('update-json-file');

const { getPkg } = require('../pkg.js');
const { JSON_OPTIONS, PACKAGE_JSON } = require('../values.js');

const LABEL = 'jest found and configured';

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  return updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      const devDeps = pkg.devDependencies || {};
      if (devDeps.jest) {
        pkg.scripts = Object.assign({}, pkg.scripts, {
          jest: 'jest'
        });
        pkg.jest = Object.assign({}, pkg.jest, {
          collectCoverage: true,
          coverageThreshold: {
            global: {
              lines: 90
            }
          }
        });
      }

      return pkg;
    },
    JSON_OPTIONS
  );
}

function isNeeded({ cwd } /* : TaskOptions */) {
  return getPkg(cwd).then(pkg => !!(pkg.devDependencies || {}).jest);
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  requires: [PACKAGE_JSON]
};
