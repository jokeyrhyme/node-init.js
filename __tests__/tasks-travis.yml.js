/* @flow */
'use strict';

jest.unmock('execa');

const {
  isNeeded,
  lib: { pruneCache, pruneInstall, updateNpm },
} = require('../lib/tasks/travis.yml.js');

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
    { hasYarn: false }
  );
  expect(results).toMatchSnapshot();
});
test('pruneInstall({ ... }, { hasYarn: true })', () => {
  const results = pruneInstall(
    {
      install: ['npm install --global yarn'],
    },
    { hasYarn: true }
  );
  expect(results).toMatchSnapshot();
});

test('updateNpm({}, { hasYarn: false })', () => {
  const results = updateNpm({}, { hasYarn: false });
  expect(results).toMatchSnapshot();
});
test('updateNpm({}, { hasYarn: true })', () => {
  const results = updateNpm({}, { hasYarn: true });
  expect(results).toMatchSnapshot();
});
