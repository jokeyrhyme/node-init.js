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
const { isPublicGitHub } = require('../git.js');
const { fetchSupportedMajors } = require('../nodejs-versions.js');
const { GIT_REPO, PACKAGE_JSON } = require('../values.js');

const LABEL = '.travis.yml initialised';

/* :: import type { TaskOptions } from '../types.js' */

function pruneCache(cfg /* : Object */) /* : Object */ {
  // anything to do with npm's cache is likely to cause EPERMs
  cfg.cache = without(cfg.cache || [], 'node_modules');

  cfg.cache = cfg.cache || {};
  cfg.cache.directories = without(cfg.cache.directories || [], 'node_modules');

  // remove completely if empty
  if (!cfg.cache.directories.length) {
    delete cfg.cache.directories;
  }
  if (!Object.keys(cfg.cache).length) {
    delete cfg.cache;
  }

  return cfg;
}

function pruneInstall(
  cfg /* : Object */,
  { hasYarn } /* : Object */,
) /* : Object */ {
  // was never a good idea to install types definitions on-the-fly
  cfg.install = without(
    cfg.install || [],
    'npm install --global flow-typed',
    'npm install --global typings',
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

function setOSMatrix(
  cfg /* : Object */,
  { os = [] } /* : Object */,
) /* : Object */ {
  if (!Array.isArray(os) || !os.length) {
    return cfg;
  }
  const matrix = { include: [] };
  if (os.includes('darwin')) {
    matrix.include.push({ os: 'osx', osx_image: 'xcode10.2' });
  }
  if (os.includes('win32')) {
    matrix.include.push({ os: 'windows' });
  }
  if (!matrix.include.length) {
    return cfg;
  }
  if (!os.includes('!linux')) {
    matrix.include.push({ os: 'linux' });
  }
  return { ...cfg, matrix };
}

function updateNpm(
  cfg /* : Object */,
  { hasYarn } /* : Object */,
) /* : Object */ {
  cfg.install = union(cfg.install || [], ['npm install --global npm']);

  // install yarn if the project uses it
  if (hasYarn) {
    cfg.install = union(cfg.install || [], ['npm install --global yarn']);
  }

  return cfg;
}

async function fn({ cwd } /* : TaskOptions */) {
  const filePath = path.join(cwd, '.travis.yml');
  const { pkg } = await readPkgUp({ cwd });
  const majors = await fetchSupportedMajors((pkg.engines || {}).node);
  await touch(filePath);
  let cfg = safeLoad(await promisify(readFile)(filePath, 'utf8')) || {};

  cfg.language = cfg.language || 'node_js';
  if (cfg.sudo === false) {
    // this is deprecated
    // https://blog.travis-ci.com/2018-11-19-required-linux-infrastructure-migration
    delete cfg.sudo;
  }

  cfg.node_js = cfg.node_js || [];
  cfg.node_js = union(cfg.node_js, majors.map(major => '' + major));

  cfg.env = cfg.env || {};
  cfg.env.global = cfg.env.global || [];
  cfg.env.global = union(cfg.env.global, ['CXX=g++-4.8']);

  cfg.addons = cfg.addons || {};
  cfg.addons.apt = cfg.addons.apt || {};
  cfg.addons.apt.sources = cfg.addons.apt.sources || [];
  cfg.addons.apt.sources = union(cfg.addons.apt.sources, [
    'ubuntu-toolchain-r-test',
  ]);
  cfg.addons.apt.packages = cfg.addons.apt.packages || [];
  cfg.addons.apt.packages = union(cfg.addons.apt.packages, ['g++-4.8']);

  const hasYarn = require('has-yarn')(cwd);
  cfg = updateNpm(cfg, { hasYarn });

  cfg.install = ensureArrayTail(cfg.install || [], 'npm install');

  cfg = pruneInstall(cfg, { hasYarn });
  cfg = pruneCache(cfg);
  cfg = setOSMatrix(cfg, { os: pkg.os });

  await promisify(writeFile)(filePath, safeDump(cfg));
}

function isNeeded({ cwd } /* : TaskOptions */) {
  // free Travis CI requires public GitHub hosting
  return isPublicGitHub(cwd);
}

module.exports = {
  fn,
  id:    path.basename(__filename),
  isNeeded,
  label: LABEL,
  lib:   {
    pruneCache,
    pruneInstall,
    setOSMatrix,
    updateNpm,
  },
  requires: [GIT_REPO, PACKAGE_JSON],
};
