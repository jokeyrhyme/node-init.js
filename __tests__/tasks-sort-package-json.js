'use strict';

jest.mock('update-json-file');

const {
  lib: { npmScript },
} = require('../lib/tasks/sort-package-json.js');

test('npmScript() versus empty package.json', async () => {
  const pkg = {};
  require('update-json-file').__setPackage(pkg);

  await npmScript('some/path');

  expect(pkg).toMatchSnapshot();
});
