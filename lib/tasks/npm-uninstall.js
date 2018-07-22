/* @flow */
'use strict';

const path = require('path');

const execa = require('execa');
const intersection = require('lodash.intersection');
const readPkgUp = require('read-pkg-up');
const { intersects } = require('semver');

const { PACKAGE_JSON } = require('../values.js');

const LABEL = 'npm packages uninstalled';

/* :: import type { TaskOptions } from '../types.js' */

async function fn({ cwd, isFlowProject } /* : TaskOptions */) {
  const { pkg } = await readPkgUp({ cwd });

  const pkgs = [
    // we use prettier instead of standard-via-eslint
    'eslint-config-semistandard',
    'eslint-config-standard',
    'eslint-config-standard-jsx',
    'eslint-config-standard-react',
    'eslint-plugin-standard',

    'fixpack', // use sort-package-json now instead
    'greenkeeper-postpublish', // Greenkeeper doesn't use this now
    'prettier', // run this via npx instead of as a devDep
  ];
  if (!isFlowProject) {
    pkgs.push('flow-bin');
  }

  // npm 5.2.x bundle includes npx
  if (pkg.engines && pkg.engines.npm && !intersects(pkg.engines.npm, '<5.2')) {
    pkgs.push('npx');
  }

  const deps = intersection(pkgs, Object.keys(pkg.dependencies || {}));
  if (deps.length) {
    await execa('npm', ['uninstall', '--save', ...deps], { cwd });
  }

  const devDeps = intersection(pkgs, Object.keys(pkg.devDependencies || {}));
  if (devDeps.length) {
    await execa('npm', ['uninstall', '--save-dev', ...devDeps], { cwd });
  }
}

module.exports = {
  fn,
  id:       path.basename(__filename),
  label:    LABEL,
  requires: [PACKAGE_JSON],
};
