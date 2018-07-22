/* @flow */
'use strict';

const { access, readFile, unlink } = require('fs');
const path = require('path');
const { promisify } = require('util');

const updateJsonFile = require('update-json-file');

const {
  JSON_OPTIONS,
  PACKAGE_JSON,
  PACKAGE_JSON_DEVDEPS,
} = require('../values.js');

const LABEL = 'ESLint installed and configured';

async function eslintIgnore(cwd) {
  const ESLINTIGNORE_PATH = path.join(cwd, '.eslintignore');

  // migrate from old .eslintignore file
  let lines;
  try {
    await promisify(access)(ESLINTIGNORE_PATH);

    const text = await promisify(readFile)(ESLINTIGNORE_PATH, 'utf8');
    lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => !!line);

    await promisify(unlink)(ESLINTIGNORE_PATH);
  } catch (err) {
    lines = [];
  }

  // populate settings in package.json
  await updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      pkg.eslintIgnore = Array.from(
        new Set([...lines, ...(pkg.eslintIgnore || [])]),
      );

      return pkg;
    },
    JSON_OPTIONS,
  );
}

/* :: import type { TaskOptions } from '../types.js' */

async function fn({ cwd } /* : TaskOptions */) {
  await eslintIgnore(cwd);
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  provides: [PACKAGE_JSON_DEVDEPS],
  requires: [PACKAGE_JSON],
};
