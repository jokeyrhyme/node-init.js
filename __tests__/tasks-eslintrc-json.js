/* @flow */
'use strict';

const {
  lib: { eslintrcUpdater },
} = require('../lib/tasks/eslintrc.json.js');

test('eslintrcUpdater() fresh with react', () => {
  const rc = {};
  eslintrcUpdater(rc, { hasReact: true });
  expect(rc).toMatchSnapshot();
});

test('eslintrcUpdater() fresh without react', () => {
  const rc = {};
  eslintrcUpdater(rc, { hasReact: false });
  expect(rc).toMatchSnapshot();
});
