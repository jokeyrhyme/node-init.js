/* @flow */
'use strict';

const path = require('path');

const locatePath = require('locate-path');
const union = require('lodash.union');
const updateJsonFile = require('update-json-file');
const without = require('lodash.without');

const { getPkg, isReactProject } = require('../pkg.js');
const { JSON_OPTIONS, PACKAGE_JSON } = require('../values.js');

const LABEL = 'ESLint configured';

/* ::
type Options = {
  hasReact: boolean
}
*/

function eslintrcUpdater(rc /* : Object */, { hasReact } /* : Options */) {
  rc.extends = rc.extends || [];
  if (!Array.isArray(rc.extends)) {
    rc.extends = rc.extends || [rc.extends];
  }

  rc.extends = without(
    rc.extends,
    'semistandard',
    'standard',
    'standard-jsx',
    'standard-react',
  );

  rc.extends = union(rc.extends, [
    'eslint:recommended',
    'plugin:node/recommended',
  ]);

  rc.plugins = rc.plugins || [];
  rc.plugins = union(rc.plugins, ['import', 'node', 'promise']);

  if (hasReact) {
    rc.extends = union(rc.extends, ['plugin:react/recommended']);
    rc.plugins = union(rc.plugins, ['react']);
  }

  return rc;
}

function eslintrc(cwd) {
  const rcPaths = [
    path.join(cwd, '.eslintrc'),
    path.join(cwd, '.eslintrc.json'),
  ];

  let hasReact = false;
  return getPkg(cwd)
    .then(pkg => {
      hasReact = isReactProject(pkg);
    })
    .then(() => locatePath(rcPaths))
    .then((cfgPath = rcPaths[1]) =>
      updateJsonFile(
        cfgPath,
        rc => eslintrcUpdater(rc, { hasReact }),
        JSON_OPTIONS,
      ),
    );
}

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  return eslintrc(cwd);
}

module.exports = {
  fn,
  id:    path.basename(__filename),
  label: LABEL,
  lib:   {
    eslintrcUpdater,
  },
  requires: [PACKAGE_JSON],
};
