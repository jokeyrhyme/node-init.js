/* @flow */
'use strict';

const path = require('path');
const updateJsonFile = require('update-json-file');

const execa = require('execa');

const {
  addScript,
  getPkg,
  hasTestFramework,
  isTestScriptUnconfigured,
  removeScript
} = require('../pkg.js');
const { JSON_OPTIONS, PACKAGE_JSON } = require('../values.js');

const LABEL = 'jest installed and configured';

function npmInstall(cwd) {
  return execa('npm', ['install', '--save-dev', 'jest'], { cwd });
}

function editPackageJson(cwd) {
  return updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      addScript(pkg, 'jest', 'jest');
      addScript(pkg, 'test', 'npm run jest'); // `npm test` runs jest

      pkg.jest = Object.assign({}, pkg.jest, {
        collectCoverage: true,
        coverageThreshold: {
          global: {
            lines: 90
          }
        }
      });

      // remove unconfigured `npm test` provided by `npm init -y`
      removeScript(pkg, 'test', 'echo "Error: no test specified"');
      removeScript(pkg, 'test', 'exit 1');

      return pkg;
    },
    JSON_OPTIONS
  );
}

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  return npmInstall(cwd).then(() => editPackageJson(cwd));
}

function isNeeded({ cwd } /* : TaskOptions */) {
  return getPkg(cwd).then(
    pkg =>
      !!(pkg.devDependencies || {}).jest ||
      (!hasTestFramework(pkg) && isTestScriptUnconfigured(pkg))
  );
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  requires: [PACKAGE_JSON]
};
