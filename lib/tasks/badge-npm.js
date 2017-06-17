/* @flow */
'use strict';

const path = require('path');

const through2 = require('through2');
const vfs = require('vinyl-fs');

const fs = require('../fs.js');
const { getPkg } = require('../pkg.js');
const { withBadge } = require('../text.js');
const { PACKAGE_JSON, PACKAGE_JSON_NAME } = require('../values.js');

const LABEL = 'NPM version badge in README.md';

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  return Promise.all([
    getPkg(cwd).then(({ name }) => name),
    fs.touch(path.join(cwd, 'README.md'))
  ]).then(
    ([pkgName]) =>
      new Promise((resolve, reject) => {
        vfs
          .src('README.md', { cwd })
          .pipe(
            through2.obj((file, enc, cb) => {
              const svgUrl = `https://img.shields.io/npm/v/${pkgName}.svg`;
              const mdBadge = `[![npm](${svgUrl}?maxAge=2592000)](https://www.npmjs.com/package/${pkgName})`;
              const contents = withBadge(file.contents.toString(enc), mdBadge);
              file.contents = Buffer.from(contents, enc);
              cb(null, file);
            })
          )
          .pipe(vfs.dest(cwd))
          .on('error', err => reject(err))
          .on('end', () => resolve());
      })
  );
}

function isNeeded({ cwd } /* : TaskOptions */) {
  // private packages should not get an NPM badge
  return getPkg(cwd).then(pkg => !pkg['private']);
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  requires: [PACKAGE_JSON, PACKAGE_JSON_NAME]
};
