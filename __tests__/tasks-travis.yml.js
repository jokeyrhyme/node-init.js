/* @flow */
'use strict';

jest.unmock('execa');

const {
  isNeeded,
  lib: { pruneCache, pruneInstall, setOSMatrix, updateNpm },
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

test('setOSMatrix({ ... }, {})', () => {
  const results = setOSMatrix({ name: 'no-explicit-os' }, {});
  expect(results).toMatchSnapshot();
});
test('setOSMatrix({ ... }, { os: ["freebsd"] })', () => {
  const results = setOSMatrix({ name: 'freebsd' }, { os: ['freebsd'] });
  expect(results).toMatchSnapshot();
});
test('setOSMatrix({ ... }, { os: ["freebsd", "!linux"] })', () => {
  const results = setOSMatrix(
    { name: 'strictly-freebsd' },
    { os: ['freebsd', '!linux'] },
  );
  expect(results).toMatchSnapshot();
});
test('setOSMatrix({ ... }, { os: ["darwin", "win32"] })', () => {
  const results = setOSMatrix(
    { name: 'darwin-win32' },
    { os: ['darwin', 'win32'] },
  );
  expect(results).toMatchSnapshot();
});
test('setOSMatrix({ ... }, { os: ["darwin", "win32", "!linux"] })', () => {
  const results = setOSMatrix(
    { name: 'strictly-darwin-win32' },
    { os: ['darwin', 'win32', '!linux'] },
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
