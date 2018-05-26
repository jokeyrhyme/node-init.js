'use strict';

jest.mock('update-json-file');

const {
  lib: { npmScript },
} = require('../lib/tasks/flowtype.js');

const TEN_SECONDS = 10 * 1e3;
jest.setTimeout(TEN_SECONDS);

test('npmScript() versus empty package.json', async () => {
  const pkg = {};
  require('update-json-file').__setPackage(pkg);

  await npmScript('some/path');

  expect(pkg).toMatchSnapshot();
});
