/* @flow */
'use strict';

const path = require('path');

const { fetchFile } = require('../fs.js');

const LABEL = '.editorconfig initialised';

const STANDARD_URL =
  'https://raw.githubusercontent.com/jokeyrhyme/standard-editorconfig/master/.editorconfig';

/* :: import type { TaskOptions } from '../types.js' */

async function fn({ cwd } /* : TaskOptions */) {
  const filePath = path.join(cwd, '.editorconfig');
  await fetchFile(filePath, STANDARD_URL);
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL
};
