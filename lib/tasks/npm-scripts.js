/* @flow */
'use strict';

const { intersects } = require('semver');
const omit = require('lodash.omit');
const path = require('path');
const updateJsonFile = require('update-json-file');

const { removeScript } = require('../pkg.js');
const { JSON_OPTIONS, PACKAGE_JSON } = require('../values.js');

const LABEL = 'npm scripts configured';

/* :: import type { TaskOptions } from '../types.js' */

function ava(pkg) {
  const scripts = {};
  if (pkg.devDependencies.ava) {
    scripts.ava = 'ava';

    if (pkg.devDependencies.nyc) {
      scripts.ava = 'nyc ava';
      scripts.nyc = 'nyc check-coverage';
    }
  }
  return scripts;
}

const fmt = () => ({
  fmt: 'npm run sort-package-json && npm run prettier',
  prettier:
    'npx -q prettier --loglevel=warn --write "**/*.{css,js,json,jsx,md,less,scss,ts,tsx}"',
  pretest: 'npm run fmt',
  'sort-package-json': 'npx -q sort-package-json',
});

const prettier = pkg => ({
  singleQuote: true,
  trailingComma: trailingComma(pkg),
});

function trailingComma(pkg /* : Object */) /* : 'all' | 'es5' */ {
  // Node.js 8.x supports "all", otherwise use "es5"
  if (!pkg.engines.node || intersects(pkg.engines.node, '<8')) {
    return 'es5';
  }
  return 'all';
}

function fn({ cwd } /* : TaskOptions */) {
  return updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      // a temporary copy of pkg that requires fewer checks
      const safePkg = {
        devDependencies: pkg.devDevendencies || {},
        engines: pkg.engines || {},
        ...pkg,
      };

      // TODO: ought to consider a better place for this?
      pkg.prettier = prettier(safePkg);

      pkg.scripts = {
        ...ava(safePkg),
        ...fmt(),
        ...(pkg.scripts || {}),
      };

      // drop fixpack
      pkg.scripts = omit(pkg.scripts, ['fixpack']);
      removeScript(pkg, 'posttest', 'npm run fixpack');

      if (pkg.scripts.postpublish === 'greenkeeper-postpublish') {
        pkg.scripts = omit(pkg.scripts, ['postpublish']);
      }

      return pkg;
    },
    JSON_OPTIONS,
  );
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  requires: [PACKAGE_JSON],
};
