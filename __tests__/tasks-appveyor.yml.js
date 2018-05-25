/* @flow */
'use strict';

const {
  isNeeded,
  lib: { pruneCache, pruneInstall, updateNodeNpm },
} = require('../lib/tasks/appveyor.yml.js');

test('isNeeded()', async () => {
  const result = await isNeeded({ cwd: process.cwd(), scope: '' });
  expect(typeof result).toBe('boolean');
});

test('pruneCache({}, { hasYarn: false })', () => {
  const results = pruneCache({});
  expect(results).toMatchSnapshot();
});

test('pruneInstall({ ... }, { hasYarn: false })', () => {
  const results = pruneInstall(
    {
      install: ['npm install --global yarn'],
    },
    { hasYarn: false },
  );
  expect(results).toMatchSnapshot();
});
test('pruneInstall({ ... }, { hasYarn: true })', () => {
  const results = pruneInstall(
    {
      install: ['npm install --global yarn'],
    },
    { hasYarn: true },
  );
  expect(results).toMatchSnapshot();
});

test('updateNodeNpm({}, { hasYarn: false })', () => {
  const results = updateNodeNpm({}, { hasYarn: false });
  expect(results).toMatchSnapshot();
});
test('updateNodeNpm({}, { hasYarn: true })', () => {
  const results = updateNodeNpm({}, { hasYarn: true });
  expect(results).toMatchSnapshot();
});
