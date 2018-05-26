/* @flow */
'use strict';

const path = require('path');

const execa = require('execa');
const { intersects } = require('semver');
const updateJsonFile = require('update-json-file');

const { addScript } = require('../pkg.js');
const {
  JSON_OPTIONS,
  PACKAGE_JSON,
  PACKAGE_JSON_DEVDEPS,
} = require('../values.js');

const LABEL = 'prettier installed and configured';

// we now rely on `npx` for this, instead of devDeps
async function npmUninstall(cwd /* : string */) {
  await execa('npm', ['uninstall', '--save-dev', 'prettier'], { cwd });
}

function trailingComma(pkg /* : any */) /* : 'all' | 'es5' */ {
  // Node.js 8.x supports "all", otherwise use "es5"
  if (
    !pkg ||
    !pkg.engines ||
    !pkg.engines.node ||
    intersects(pkg.engines.node, '<8')
  ) {
    return 'es5';
  }
  return 'all';
}

async function npmScript(cwd /* : string */) {
  await updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      pkg.scripts = pkg.scripts || {};
      pkg.scripts.prettier =
        'npx -q prettier --loglevel=warn --write "**/*.{css,js,json,jsx,md,less,scss,ts,tsx}"';

      addScript(pkg, 'pretest', 'npm run prettier');

      pkg.prettier = {
        singleQuote: true,
        trailingComma: trailingComma(pkg),
      };

      return pkg;
    },
    JSON_OPTIONS,
  );
}

/* :: import type { TaskOptions } from '../types.js' */

async function fn({ cwd } /* : TaskOptions */) {
  await npmUninstall(cwd);
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
