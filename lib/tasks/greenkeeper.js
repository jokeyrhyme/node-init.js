/* @flow */
'use strict';

const path = require('path');

const updateJsonFile = require('update-json-file');

const { JSON_OPTIONS, PACKAGE_JSON } = require('../values.js');

const LABEL = 'greenkeeper.io integration';

/* :: import type { PackageJSON, TaskOptions } from '../types.js' */

function pkgUpdater(pkg /* : PackageJSON */) {
  // greenkeeper no longer requires publish-hook integration
  const { devDependencies = {}, scripts = {} } = pkg;

  delete (devDependencies || {})['greenkeeper-postpublish'];
  if (!Object.keys(devDependencies).length) {
    delete pkg.devDependencies;
  }

  if (scripts.postpublish === 'greenkeeper-postpublish') {
    delete scripts.postpublish;
  }
  if (!Object.keys(scripts).length) {
    delete pkg.scripts;
  }

  return pkg;
}

function fn({ cwd } /* : TaskOptions */) {
  return updateJsonFile(
    path.join(cwd, 'package.json'),
    pkgUpdater,
    JSON_OPTIONS
  );
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  pkgUpdater,
  requires: [PACKAGE_JSON],
};
