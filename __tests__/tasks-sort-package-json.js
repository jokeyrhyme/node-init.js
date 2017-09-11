/* @flow */
'use strict';

jest.mock('execa');
jest.mock('update-json-file');

test('fn()', async () => {
  const { fn } = require('../lib/tasks/sort-package-json.js');
  await fn({ cwd: process.cwd(), scope: '' });

  expect(require('execa').mock.calls).toMatchSnapshot();

  // $FlowFixMe: ignore .mock's missing type
  expect(require('update-json-file').mock.calls.length).toBe(1);

  // $FlowFixMe: ignore .mock's missing type
  const editor = require('update-json-file').mock.calls[0][1];
  expect(editor({})).toMatchSnapshot();
});
