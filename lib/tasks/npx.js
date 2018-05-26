/* @flow */
'use strict';

const path = require('path');

const execa = require('execa');
const { intersects } = require('semver');

const { getPkg } = require('../pkg.js');
const { PACKAGE_JSON, PACKAGE_JSON_DEVDEPS } = require('../values.js');

const LABEL = 'npx (un)installed';

function npmInstall(cwd /* : string */) {
  return getPkg(cwd).then(pkg => {
    const { devDependencies = {} } = pkg;
    // npm 5.2.x bundle includes npx
    if (
      !pkg ||
      !pkg.engines ||
      !pkg.engines.npm ||
      intersects(pkg.engines.npm, '<5.2')
    ) {
      if (!devDependencies.npx) {
        return execa(
          'npm',
          ['install', '--no-save-exact', '--save-dev', 'npx'],
          {
            cwd,
          },
        );
      }
    } else {
      if (devDependencies.npx) {
        return execa('npm', ['uninstall', '--save-dev', 'npx'], {
          cwd,
        });
      }
    }
  });
}

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  return npmInstall(cwd);
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  provides: [PACKAGE_JSON_DEVDEPS],
  requires: [PACKAGE_JSON],
};
