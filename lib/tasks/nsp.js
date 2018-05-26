/* @flow */
'use strict';

const path = require('path');

const { intersects } = require('semver');
const updateJsonFile = require('update-json-file');

const { addScript, removeScript } = require('../pkg.js');
const {
  JSON_OPTIONS,
  PACKAGE_JSON,
  PACKAGE_JSON_DEVDEPS,
} = require('../values.js');

const LABEL = 'nsp installed and configured';

async function npmScript(cwd /* : string */) {
  await updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      pkg.scripts = pkg.scripts || {};

      // npm 6.x has built-in "audit" command
      if (
        !pkg ||
        !pkg.engines ||
        !pkg.engines.npm ||
        intersects(pkg.engines.npm, '<6')
      ) {
        pkg.scripts.nsp = 'npx -q nsp check';
        addScript(pkg, 'test', 'npm run nsp');
      } else {
        addScript(pkg, 'test', 'npm audit');

        delete pkg.scripts.nsp;
        removeScript(pkg, 'test', 'npm run nsp');
      }

      return pkg;
    },
    JSON_OPTIONS,
  );
}

/* :: import type { TaskOptions } from '../types.js' */

async function fn({ cwd } /* : TaskOptions */) {
  await npmScript(cwd);
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  lib: {
    npmScript,
  },
  provides: [PACKAGE_JSON_DEVDEPS],
  requires: [PACKAGE_JSON],
};
