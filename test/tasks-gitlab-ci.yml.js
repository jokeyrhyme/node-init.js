/* @flow */
'use strict';

const test = require('ava');

const {
  isNeeded,
  lib: { editConfig }
} = require('../lib/tasks/gitlab-ci.yml.js');

test('editConfig({}, { hasYarn: false })', t => {
  const results = editConfig({}, { hasYarn: false, majors: [8] });
  t.snapshot(results);
});
test('editConfig({}, { hasYarn: true })', t => {
  const results = editConfig({}, { hasYarn: true, majors: [8] });
  t.snapshot(results);
});

test('isNeeded()', async t => {
  const result = await isNeeded({ cwd: process.cwd(), scope: '' });
  t.is(typeof result, 'boolean');
});
