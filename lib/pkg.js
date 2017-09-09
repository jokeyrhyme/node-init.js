/* @flow */
'use strict';

const path = require('path');

const intersection = require('lodash.intersection');
const loadJson = require('load-json-file');
const union = require('lodash.union');
const without = require('lodash.without');

const MATCH_SCOPE_REGEXP = /^@(\w[\w_.-]*)\//;
const SCOPED_REGEXP = /^@(\w[\w_.-]*)\/(\w[\w_.-]*)$/;

/* :: import type { PackageJSON, PackageJSONDependencies } from './types.js' */

function addScript(
  pkg /* : PackageJSON */,
  name /* : string */,
  value /* : string */
) {
  const scripts = pkg.scripts || {};

  let values = (scripts[name] || '').split(' && ');
  values = values.filter(v => !!v); // drop empties
  values = union(values, [value]);
  scripts[name] = values.join(' && ');

  pkg.scripts = scripts;
}

function getPkg(cwd /* : string */) /* : Promise<PackageJSON> */ {
  return loadJson(path.join(cwd, 'package.json')).catch(() => ({})); // no file? default to new Object
}

function getScope(
  cwd /* : string */,
  scope /* : string */
) /* : Promise<string> */ {
  if (scope) {
    return Promise.resolve(scope.replace(/@/g, ''));
  }
  return getPkg(cwd).then(pkg => {
    if (!pkg.name || typeof pkg.name !== 'string') {
      return '';
    }
    if (!SCOPED_REGEXP.test(pkg.name)) {
      return '';
    }
    const [, pkgScope] = pkg.name.match(MATCH_SCOPE_REGEXP) || [];
    return pkgScope;
  });
}

function hasTestFramework(
  { devDependencies = {} } /* : PackageJSON */
) /* : boolean */ {
  return (
    intersection(Object.keys(devDependencies), [
      'ava',
      'jasmine',
      'jest',
      'lab',
      'mocha',
      'qunit',
      'qunitjs',
      'tap',
      'tape'
    ]).length > 0
  );
}

function injectScope(scope /* : string */, name /* : string */) {
  const [, currentScope, currentName] = name.match(SCOPED_REGEXP) || [];
  if (currentScope && currentName) {
    if (scope && scope !== currentScope) {
      return `@${scope}/${currentName}`;
    }
    return name;
  }
  if (scope) {
    return `@${scope}/${name}`;
  }
  return name;
}

function isReactProject(
  {
    dependencies = {},
    devDependencies = {},
    peerDependencies = {}
  } /* : PackageJSON */
) /* : boolean */ {
  return !!(
    dependencies.react ||
    devDependencies.react ||
    devDependencies['react-scripts'] ||
    peerDependencies.react
  );
}

function isTestScriptUnconfigured({ scripts = {} } /* : PackageJSON */) {
  const NPM_INIT_TEST = 'echo "Error: no test specified" && exit 1';
  return !scripts.test || scripts.test === NPM_INIT_TEST;
}

function removeScript(
  pkg /* : PackageJSON */,
  name /* : string */,
  value /* : string */
) {
  const scripts = pkg.scripts || {};

  let values = (scripts[name] || '').split(' && ');
  values = values.filter(pt => !!pt); // drop empties
  values = without(values, value);
  if (values.length) {
    scripts[name] = values.join(' && ');
  } else {
    delete scripts[name];
  }

  pkg.scripts = scripts;
}

module.exports = {
  addScript,
  getPkg,
  getScope,
  hasTestFramework,
  injectScope,
  isReactProject,
  isTestScriptUnconfigured,
  removeScript
};
