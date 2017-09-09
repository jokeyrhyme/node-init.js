/* @flow */
'use strict';

const {
  isNeeded,
  lib: { editConfig }
} = require('../lib/tasks/gitlab-ci.yml.js');

test('editConfig({}, { hasYarn: false })', () => {
  const results = editConfig({}, { hasYarn: false, majors: [8] });
  expect(results).toMatchSnapshot();
});
test('editConfig({}, { hasYarn: true })', () => {
  const results = editConfig({}, { hasYarn: true, majors: [8] });
  expect(results).toMatchSnapshot();
});

test('isNeeded()', async () => {
  const result = await isNeeded({ cwd: process.cwd(), scope: '' });
  expect(typeof result).toBe('boolean');
});
