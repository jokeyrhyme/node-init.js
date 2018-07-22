/* @flow */
'use strict';

const path = require('path');

const through2 = require('through2');
const vfs = require('vinyl-fs');

const { touch } = require('../fs.js');
const { getGitHubPath, getOriginUrl, isPublicGitHub } = require('../git.js');
const { withBadge } = require('../text.js');
const { GIT_REPO, PACKAGE_JSON } = require('../values.js');

const LABEL = 'Travis CI badge in README.md';

/* :: import type { TaskOptions } from '../types.js' */

async function fn({ cwd } /* : TaskOptions */) {
  const githubPath = await getGitHubPath(await getOriginUrl(cwd));
  await touch(path.join(cwd, 'README.md'));
  await new Promise((resolve, reject) => {
    vfs
      .src('README.md', { cwd })
      .pipe(
        through2.obj((file, enc, cb) => {
          const svgUrl = `https://travis-ci.org/${githubPath}.svg?branch=master`;
          const mdBadge = `[![Travis CI Status](${svgUrl})](https://travis-ci.org/${githubPath})`;
          const contents = withBadge(file.contents.toString(enc), mdBadge);
          file.contents = Buffer.from(contents, enc);
          cb(null, file);
        }),
      )
      .pipe(vfs.dest(cwd))
      .on('error', err => reject(err))
      .on('end', () => resolve());
  });
}

function isNeeded({ cwd } /* : TaskOptions */) {
  // free Travis CI requires public GitHub hosting
  return isPublicGitHub(cwd);
}

module.exports = {
  fn,
  id:       path.basename(__filename),
  isNeeded,
  label:    LABEL,
  requires: [GIT_REPO, PACKAGE_JSON],
};
