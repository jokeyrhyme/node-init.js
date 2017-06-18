/* @flow */
'use strict';

const test = require('ava');

const {
  isNeeded,
  lib: { pruneCache, pruneInstall, updateNodeNpm }
} = require('../lib/tasks/appveyor.yml.js');

test('isNeeded()', async t => {
  const result = await isNeeded({ cwd: process.cwd(), scope: '' });
  t.is(typeof result, 'boolean');
});

test('pruneCache({}, { hasYarn: false })', t => {
  const results = pruneCache({});
  t.snapshot(results);
});

test('pruneInstall({ ... }, { hasYarn: false })', t => {
  const results = pruneInstall(
    {
      install: ['npm install --global yarn']
    },
    { hasYarn: false }
  );
  t.snapshot(results);
});
test('pruneInstall({ ... }, { hasYarn: true })', t => {
  const results = pruneInstall(
    {
      install: ['npm install --global yarn']
    },
    { hasYarn: true }
  );
  t.snapshot(results);
});

test('updateNodeNpm({}, { hasYarn: false })', t => {
  const results = updateNodeNpm({}, { hasYarn: false });
  t.snapshot(results);
});
test('updateNodeNpm({}, { hasYarn: true })', t => {
  const results = updateNodeNpm({}, { hasYarn: true });
  t.snapshot(results);
});
