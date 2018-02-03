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

const LABEL = 'appveyor.yml initialised';

/* :: import type { TaskOptions } from '../types.js' */

function pruneCache(cfg /* : Object */) /* : Object */ {
  // anything to do with npm's cache is likely to cause EPERMs
  cfg.cache = without(cfg.cache || [], 'node_modules');

  // remove completely if empty
  if (!cfg.cache.length) {
    delete cfg.cache;
  }

  return cfg;
}

function pruneInstall(
  cfg /* : Object */,
  { hasYarn } /* : Object */
) /* : Object */ {
  // was never a good idea to install types definitions on-the-fly
  cfg.install = without(
    cfg.install || [],
    'npm install --global npm',
    'npm install --global flow-typed',
    'npm install --global typings'
  );

  // don't install yarn if the project does not use it
  if (!hasYarn) {
    cfg.install = without(cfg.install || [], 'npm install --global yarn');
  }

  // anything to do with npm's cache is likely to cause EPERMs
  cfg.install = without(cfg.install || [], 'npm cache clean');

  // remove completely if empty
  if (!cfg.install.length) {
    delete cfg.install;
  }

  return cfg;
}

function updateNodeNpm(
  cfg /* : Object */,
  { hasYarn } /* : Object */
) /* : Object */ {
  // fix any non-64-bit Node.js install steps
  cfg.install = (cfg.install || []).map(step => {
    if (step.ps === 'Install-Product node $env:nodejs_version') {
      return {
        ps: 'Install-Product node $env:nodejs_version x64',
      };
    }
    return step;
  });

  // ensure 64-bit Node.js version from matrix is installed
  if (
    cfg.install.every(step => {
      return step.ps !== 'Install-Product node $env:nodejs_version x64';
    })
  ) {
    cfg.install.unshift({
      ps: 'Install-Product node $env:nodejs_version x64',
    });
  }

  cfg.install = union(cfg.install || [], [
    'npm install --global npm-windows-upgrade',
    'npm-windows-upgrade --no-spinner --npm-version latest',
  ]);

  // install yarn if the project uses it
  if (hasYarn) {
    cfg.install = union(cfg.install || [], ['npm install --global yarn']);
  }

  return cfg;
}

async function fn({ cwd } /* : TaskOptions */) {
  const filePath = path.join(cwd, 'appveyor.yml');
  await touch(filePath);

  const { pkg } = await readPkgUp({ cwd });
  const majors = await fetchSupportedMajors((pkg.engines || {}).node);

  const contents = await promisify(readFile)(filePath, 'utf8');
  let cfg = safeLoad(contents) || {};

  cfg.build = cfg.build || 'off';

  cfg.environment = cfg.environment || {};
  cfg.environment.matrix = cfg.environment.matrix || [];
  majors.forEach(major => {
    if (
      cfg.environment.matrix.every(env => {
        return env.nodejs_version !== '' + major;
      })
    ) {
      cfg.environment.matrix.push({ nodejs_version: '' + major });
    }
  });

  const hasYarn = require('has-yarn')(cwd);
  cfg = updateNodeNpm(cfg, { hasYarn });

  cfg.install = ensureArrayTail(cfg.install, 'npm install');

  cfg.test_script = cfg.test_script || [];
  cfg.test_script = union(cfg.test_script, [
    'node --version',
    'npm --version',
    'npm test',
  ]);

  // anything to do with npm's cache is likely to cause EPERMs
  cfg.test_script = without(cfg.test_script, 'npm cache clean');

  cfg = pruneInstall(cfg, { hasYarn });
  cfg = pruneCache(cfg);

  const data = safeDump(cfg);
  await promisify(writeFile)(filePath, data);
}

function isNeeded({ cwd } /* : TaskOptions */) {
  // free AppVeyor requires public GitHub / Bitbucket hosting
  return isPublicGitHubOrBitbucket(cwd);
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  lib: {
    pruneCache,
    pruneInstall,
    updateNodeNpm,
  },
  requires: [GIT_REPO, PACKAGE_JSON],
};
