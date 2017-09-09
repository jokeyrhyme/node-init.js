/* @flow */
'use strict';

const { access } = require('fs');
const path = require('path');
const { promisify } = require('util');

const readPkgUp = require('read-pkg-up');

const { copyFile } = require('../fs.js');
const { PACKAGE_JSON, PROJECT_CODE } = require('../values.js');

const LABEL = 'package "main" points to a file that exists';

const SKELETON_INDEX_PATH = path.join(__dirname, '..', 'skeleton', 'index.js');

/* :: import type { TaskOptions } from '../types.js' */

async function fn({ cwd } /* : TaskOptions */) {
  const { pkg, path: pkgPath } = await readPkgUp({ cwd });
  if (!pkg.main || typeof pkg.main !== 'string') {
    return;
  }

  const mainPath = path.join(path.dirname(pkgPath), pkg.main);
  try {
    await promisify(access)(mainPath);
  } catch (err) {
    await copyFile(SKELETON_INDEX_PATH, mainPath);
  }
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  provides: [PROJECT_CODE],
  requires: [PACKAGE_JSON]
};
