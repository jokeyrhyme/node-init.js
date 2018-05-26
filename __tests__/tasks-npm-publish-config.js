'use strict';

jest.mock('update-json-file');

const {
  lib: { packageJSON },
} = require('../lib/tasks/npm-publish-config.js');

test('packageJSON() fresh', async () => {
  const pkg = {};
  require('update-json-file').__setPackage(pkg);

  await packageJSON('some/path');

  expect(pkg).toMatchSnapshot();
});
