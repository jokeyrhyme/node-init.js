/* @flow */
'use strict';

const os = require('os');
const path = require('path');

const through2 = require('through2');
const vfs = require('vinyl-fs');

const fs = require('../fs.js');

const LABEL = '.eslintignore populated';
const FILENAME = '.eslintignore';

/* :: import type { TaskOptions } from '../types.js' */

const IGNORES = ['build', 'coverage', 'dist'];

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
                if (
                  !contents.includes(`\n${entry}\n`) &&
                  !contents.includes(`\r\n${entry}\r\n`)
                ) {
                  contents += `${os.EOL}${entry}${os.EOL}`;
                }
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
