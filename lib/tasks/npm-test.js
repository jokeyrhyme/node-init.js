/* @flow */
'use strict';

const path = require('path');
const updateJsonFile = require('update-json-file');

const { JSON_OPTIONS, PACKAGE_JSON } = require('../values.js');

const LABEL = '`npm test` executes installed test runners';

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  return updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      const devDeps = pkg.devDependencies || {};
      if (devDeps.ava) {
        pkg.scripts = Object.assign({}, pkg.scripts, {
          ava: 'ava'
        });
        if (devDeps.nyc) {
          pkg.scripts = Object.assign({}, pkg.scripts, {
            ava: 'nyc ava',
            nyc: 'nyc check-coverage'
          });
        }
      }

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
          },
          testRegex: '/__tests__/[^\\/]*\\.js$'
        });
      }

      if (devDeps.mocha) {
        pkg.scripts = Object.assign({}, pkg.scripts, {
          mocha: 'mocha'
        });
      }

      return pkg;
    },
    JSON_OPTIONS
  );
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  requires: [PACKAGE_JSON]
};
