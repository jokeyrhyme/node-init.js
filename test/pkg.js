'use strict';

const path = require('path');

const test = require('ava');

const { getScope, injectScope, isReactProject } = require('../lib/pkg.js');

function shortCwd(cwd) {
  return `.../${path.basename(cwd || '')}`;
}

function fixturePath(name) {
  return path.join(__dirname, 'fixtures', name);
}

const getScopeData = [
  { cwd: __dirname, scope: '', expected: '' },
  { cwd: __dirname, scope: 'org', expected: 'org' },
  { cwd: __dirname, scope: '@org', expected: 'org' },
  { cwd: fixturePath('named'), scope: 'org', expected: 'org' },
  { cwd: fixturePath('named'), scope: '', expected: '' },
  { cwd: fixturePath('scoped'), scope: '', expected: 'myscope' },
  { cwd: fixturePath('scoped'), scope: 'org', expected: 'org' }
];

getScopeData.forEach(d =>
  test(`getScope("${shortCwd(d.cwd)}", "${d.scope}")`, t =>
    getScope(d.cwd, d.scope).then(scope => t.is(scope, d.expected)))
);

const injectScopeData = [
  { args: ['', ''], expected: '' },
  { args: ['', 'name'], expected: 'name' },
  { args: ['new', 'name'], expected: '@new/name' },
  { args: ['', '@org/name'], expected: '@org/name' },
  { args: ['new', '@org/name'], expected: '@new/name' }
];

injectScopeData.forEach(d =>
  test(`injectScope(${JSON.stringify(d.args)})`, t =>
    t.is(injectScope(...d.args), d.expected))
);

/* :: import type { PackageJSON, ReactProjectData } from '../lib/types.js' */

const isReactProjectData /* : Array<ReactProjectData> */ = [
  { pkg: { name: 'a', version: '1' }, expected: false },
  { pkg: { name: 'a', version: '1', dependencies: {} }, expected: false },
  {
    pkg: { name: 'a', version: '1', dependencies: { react: '*' } },
    expected: true
  },
  {
    pkg: { name: 'a', version: '1', devDependencies: { react: '*' } },
    expected: true
  },
  {
    pkg: { name: 'a', version: '1', devDependencies: { 'react-scripts': '*' } },
    expected: true
  },
  {
    pkg: { name: 'a', version: '1', peerDependencies: { react: '*' } },
    expected: true
  }
];

isReactProjectData.forEach(d =>
  test(`isReactProject(${JSON.stringify(d.pkg)})`, t =>
    t.is(isReactProject(d.pkg), d.expected))
);
