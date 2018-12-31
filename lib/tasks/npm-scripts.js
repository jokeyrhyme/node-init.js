/* @flow */
'use strict';

const { intersects } = require('semver');
const omit = require('lodash.omit');
const path = require('path');
const updateJsonFile = require('update-json-file');

const {
  addScript,
  hasTestFramework,
  isTestScriptUnconfigured,
  removeScript,
} = require('../pkg.js');
const { JSON_OPTIONS, PACKAGE_JSON } = require('../values.js');

const LABEL = 'npm scripts configured';

/* :: import type { TaskOptions } from '../types.js' */

function audit(pkg /* : Object */) {
  // npm 6.x has built-in "audit" command
  if (pkg.engines && pkg.engines.npm && !intersects(pkg.engines.npm, '<6')) {
    addScript(pkg, 'test', 'npm audit');
  }
  // `nsp` has been decommissioned upstream
  delete pkg.scripts.nsp;
  removeScript(pkg, 'test', 'npm run nsp');
  return pkg;
}

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
  'fmt:eslint': [
    'eslint --fix --no-eslintrc',
    '--parser-options "ecmaVersion:2018,ecmaFeatures:{jsx:true}"',
    '--rule "key-spacing:[error,{align:value}]"',
    '.',
  ].join(' '),
  fmt:      'npm run sort-package-json && npm run prettier && npm run fmt:eslint',
  prettier:
    'npx -q prettier --loglevel=warn --write "**/*.{css,htm,html,js,json,jsx,md,less,scss,ts,tsx,vue}"',
  pretest:             'npm run fmt',
  'sort-package-json': 'npx -q sort-package-json',
});

function flow(pkg /* : Object */, isFlowProject /* : boolean */) {
  if (isFlowProject) {
    pkg.scripts.flow = `flow check`;
    addScript(pkg, 'lint', 'npm run flow');
  } else {
    pkg.scripts = omit(pkg.scripts, ['flow']);
    for (const script of ['lint', 'pretest', 'test', 'posttest']) {
      removeScript(pkg, script, 'npm run flow');
    }
  }

  // we call as part of "lint" now, not in "test"
  removeScript(pkg, 'test', 'npm run flow');

  // drop our old Flow script name
  pkg.scripts = omit(pkg.scripts, ['flow_check']);
  for (const script of ['pretest', 'test', 'posttest']) {
    removeScript(pkg, script, 'npm run flow_check');
  }

  return pkg;
}

const lint = () => ({
  eslint: 'eslint --cache --fix .',
  lint:   'npm run eslint',
});

function jest(pkg) {
  if (
    (pkg.devDependencies || {}).jest ||
    (!hasTestFramework(pkg) && isTestScriptUnconfigured(pkg))
  ) {
    addScript(pkg, 'jest', 'jest');
    addScript(pkg, 'test', 'npm run jest'); // `npm test` runs jest

    pkg.jest = {
      ...pkg.jest,
      collectCoverage:   true,
      coverageThreshold: (pkg.jest || {}).coverageThreshold || {
        global: {
          lines: 90,
        },
      },
    };
  }

  return pkg;
}

const prettier = pkg => ({
  singleQuote:   true,
  trailingComma: trailingComma(pkg),
});

function trailingComma(pkg /* : Object */) /* : 'all' | 'es5' */ {
  // Node.js 8.x supports "all", otherwise use "es5"
  if (!pkg.engines.node || intersects(pkg.engines.node, '<8')) {
    return 'es5';
  }
  return 'all';
}

function fn({ cwd, isFlowProject = false } /* : TaskOptions */) {
  return updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      // remove unconfigured `npm test` provided by `npm init -y`
      removeScript(pkg, 'test', 'echo "Error: no test specified"');
      removeScript(pkg, 'test', 'exit 1');

      // a temporary copy of pkg that requires fewer checks
      const safePkg = {
        devDependencies: pkg.devDevendencies || {},
        engines:         pkg.engines || {},
        scripts:         pkg.scripts || {},
        ...pkg,
      };

      // TODO: ought to consider a better place for this?
      pkg = jest(pkg);
      pkg = audit(pkg);
      pkg.prettier = prettier(safePkg);

      pkg.scripts = {
        ...(pkg.scripts || {}),
        ...ava(safePkg),
        ...fmt(),
        ...lint(),
      };
      addScript(pkg, 'test', 'npm run lint');
      pkg = flow(
        pkg,
        isFlowProject,
      );

      // drop fixpack
      pkg.scripts = omit(pkg.scripts, ['fixpack']);
      removeScript(pkg, 'posttest', 'npm run fixpack');

      // stop calling ESLint in the old places / ways
      for (const script of ['test', 'posttest']) {
        removeScript(pkg, script, 'npm run eslint');
      }

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
  id:       path.basename(__filename),
  label:    LABEL,
  requires: [PACKAGE_JSON],
};
