/* @flow */
'use strict';

const { readFile, writeFile } = require('fs');
const path = require('path');
// $FlowFixMe: util.promisify is tricky to define :(
const { promisify } = require('util');

const { safeDump, safeLoad } = require('js-yaml');
const readPkgUp = require('read-pkg-up');
const union = require('lodash.union');
const without = require('lodash.without');

const { ensureArrayTail } = require('../data.js');
const { touch } = require('../fs.js');
const { isPublicGitHubOrBitbucket } = require('../git.js');
const { fetchSupportedMajors } = require('../nodejs-versions.js');
const { GIT_REPO, PACKAGE_JSON } = require('../values.js');

const LABEL = '.gitlab-ci.yml initialised';

/* :: import type { TaskOptions } from '../types.js' */

function editConfig(
  cfg /* : Object */,
  { hasYarn, majors } /* : Object */
) /* : Object */ {
  cfg.before_script = union(cfg.before_script || [], [
    'apt-get update -qq',
    'apt-get install -qy libelf1',
    'npm install --global npm'
  ]);

  // install yarn if the project uses it
  if (hasYarn) {
    cfg.before_script = union(cfg.before_script || [], [
      'npm install --global yarn'
    ]);
  } else {
    cfg.before_script = without(
      cfg.before_script || [],
      'npm install --global yarn'
    );
  }

  cfg.before_script = ensureArrayTail(cfg.before_script || [], 'npm install');

  cfg.test = cfg.test || {};

  // test against the oldest supported major version of Node.js
  cfg.test.image = cfg.test.image || 'node:' + majors[0];

  cfg.test.script = union(cfg.test.script || [], ['npm test']);

  return cfg;
}

async function fn({ cwd } /* : TaskOptions */) {
  const filePath = path.join(cwd, '.gitlab-ci.yml');
  const { pkg } = await readPkgUp({ cwd });
  const majors = await fetchSupportedMajors((pkg.engines || {}).node);
  await touch(filePath);
  let cfg = safeLoad(await promisify(readFile)(filePath, 'utf8')) || {};

  const hasYarn = require('has-yarn')(cwd);
  cfg = editConfig(cfg, { hasYarn, majors });

  await promisify(writeFile)(filePath, safeDump(cfg));
}

function isNeeded({ cwd } /* : TaskOptions */) {
  // if not GitHub or Bitbucket, then assume GitLab
  return isPublicGitHubOrBitbucket(cwd).then(result => !result);
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  lib: { editConfig },
  requires: [GIT_REPO, PACKAGE_JSON]
};
