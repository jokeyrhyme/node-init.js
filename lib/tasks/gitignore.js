/* @flow */
'use strict';

const os = require('os');
const path = require('path');

const through2 = require('through2');
const vfs = require('vinyl-fs');

const fs = require('../fs.js');

const LABEL = '.gitignore set for Node.js';

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  return fs.touch(path.join(cwd, '.gitignore')).then(
    () =>
      new Promise((resolve, reject) => {
        vfs
          .src('.gitignore', { cwd })
          .pipe(
            through2.obj((file, enc, cb) => {
              let contents = file.contents.toString(enc);
              if (!/\bnode_modules\b/.test(contents)) {
                contents += `${os.EOL}node_modules${os.EOL}`;
              }
              if (!/\.eslintcache\b/.test(contents)) {
                contents += `${os.EOL}.eslintcache${os.EOL}`;
              }
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

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL
};
