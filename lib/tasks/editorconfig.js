/* @flow */
'use strict';

const path = require('path');

const fetch = require('node-fetch');

const fs = require('../fs.js');

const LABEL = '.editorconfig initialised';

const STANDARD_URL =
  'https://raw.githubusercontent.com/jokeyrhyme/standard-editorconfig/master/.editorconfig';

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  const filePath = path.join(cwd, '.editorconfig');
  return fetch(STANDARD_URL)
    .then(res => res.text())
    .then(data => fs.writeFile(filePath, data));
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL
};
