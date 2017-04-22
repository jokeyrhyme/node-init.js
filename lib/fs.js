/* @flow */
'use strict';

const fs = require('@jokeyrhyme/pify-fs');

function copyFile(
  src /* : string */,
  dest /* : string */
) /* : Promise<void> */ {
  return fs.readFile(src).then(data => fs.writeFile(dest, data));
}

function touch(filePath) {
  return fs.access(filePath).catch(() => fs.writeFile(filePath, ''));
}

module.exports = Object.assign(
  {
    copyFile,
    touch
  },
  fs
);
