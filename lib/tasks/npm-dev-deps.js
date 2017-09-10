/* @flow */
'use strict';

const path = require('path');

const semver = require('semver');
const updateJsonFile = require('update-json-file');

const {
  JSON_OPTIONS,
  PACKAGE_JSON,
  PACKAGE_JSON_DEVDEPS,
} = require('../values.js');

const LABEL = 'devDeps in package.json permit MINOR and PATCH updates';

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  return updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      pkg.devDependencies = pkg.devDependencies || {};
      Object.keys(pkg.devDependencies).forEach(dep => {
        const version = pkg.devDependencies[dep];
        if (semver.valid(version)) {
          pkg.devDependencies[dep] = version.replace(/^\D*(\d)/, '^$1');
        }
      });
      return pkg;
    },
    JSON_OPTIONS
  );
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  settles: [PACKAGE_JSON, PACKAGE_JSON_DEVDEPS],
};
