/* @flow */
'use strict';

const path = require('path');

const execa = require('execa');
const { intersects, major } = require('semver');
const updateJsonFile = require('update-json-file');

const { JSON_OPTIONS, PACKAGE_JSON } = require('../values.js');

// https://nodejs.org/en/download/releases/
const NODE_RANGE_WITH_OLD_NPM = '<8.12 || >=9 <10.2.1';
const LABEL = '"engines" set in package.json';

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  const node = major(process.version);
  return execa('npm', ['--version'])
    .then(result => major(result.stdout))
    .then(npm =>
      updateJsonFile(
        path.join(cwd, 'package.json'),
        pkg => {
          pkg.engines = pkg.engines || {};
          pkg.engines.node = pkg.engines.node || `>=${node}`;
          pkg.engines.npm = pkg.engines.npm || `>=${npm}`;

          // make special effort here to lift minimum npm to 6.x,
          // when all supported Node.js versions come with npm 6.x,
          // as it offers `npm audit` which is desirable
          if (
            npm >= 6 &&
            intersects(pkg.engines.npm, '<6') &&
            !intersects(pkg.engines.node, NODE_RANGE_WITH_OLD_NPM)
          ) {
            pkg.engines.npm = `>=${npm}`;
          }

          return pkg;
        },
        JSON_OPTIONS,
      ),
    );
}

module.exports = {
  fn,
  id:       path.basename(__filename),
  label:    LABEL,
  requires: [PACKAGE_JSON],
};
