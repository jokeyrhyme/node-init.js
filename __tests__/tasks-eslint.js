/* @flow */
'use strict';

jest.mock('fs');

jest.mock('execa');
jest.mock('update-json-file');

test('fn()', async () => {
  const { fn } = require('../lib/tasks/eslint.js');
  await fn({ cwd: process.cwd(), scope: '' });

  expect(require('execa').mock.calls).toMatchSnapshot();

  // $FlowFixMe: ignore .mock's missing type
  expect(require('update-json-file').mock.calls.length).toBe(2);

  // $FlowFixMe: ignore .mock's missing type
  for (const [filePath, editor] of require('update-json-file').mock.calls) {
    expect(filePath).toMatchSnapshot();
    expect(editor({})).toMatchSnapshot();
  }
});
