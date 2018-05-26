/* @flow */
'use strict';

const path = require('path');

const through2 = require('through2');
const vfs = require('vinyl-fs');

const fs = require('../fs.js');
const { withLine } = require('../text.js');

const LABEL = '.gitignore set for Node.js';

const IGNORES = ['.eslintcache', 'node_modules'];
const FILENAME = '.gitignore';

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  return fs.touch(path.join(cwd, FILENAME)).then(
    () =>
      new Promise((resolve, reject) => {
        vfs
          .src(FILENAME, { cwd })
          .pipe(
            through2.obj((file, enc, cb) => {
              let contents = file.contents.toString(enc);

              for (const entry of IGNORES) {
                contents = withLine(contents, entry);
              }

              file.contents = Buffer.from(contents, enc);
              cb(null, file);
            }),
          )
          .pipe(vfs.dest(cwd))
          .on('error', err => reject(err))
          .on('end', () => resolve());
      }),
  );
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
};
