/* @flow */
'use strict';

const path = require('path');

const execa = require('execa');
const semver = require('semver');
const updateJsonFile = require('update-json-file');

const { JSON_OPTIONS, PACKAGE_JSON } = require('../values.js');

const LABEL = '"engines" set in package.json';

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  const node = semver.major(process.version);
  return execa('npm', ['--version'])
    .then(result => semver.major(result.stdout))
    .then(npm =>
      updateJsonFile(
        path.join(cwd, 'package.json'),
        pkg => {
          pkg.engines = pkg.engines || {};
          pkg.engines.node = pkg.engines.node || `>=${node}`;
          pkg.engines.npm = pkg.engines.npm || `>=${npm}`;
          return pkg;
        },
        JSON_OPTIONS
      )
    );
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  requires: [PACKAGE_JSON]
};
