'use strict';

jest.mock('update-json-file');

const os = require('os');

const execa = require('execa');

const { lib: { npmScript } } = require('../lib/tasks/prettier.js');

const TEN_SECONDS = 10 * 1e3;
jest.setTimeout(TEN_SECONDS);

test('`npm run prettier` finds correct files', async () => {
  let { stdout } = await execa('npm', [
    'run',
    'prettier',
    '--',
    '--no-list-different',
  ]);

  // output on Windows includes the full path to prettier
  // so we have to strip it before the next assertion
  if (/^win/.test(os.platform())) {
    stdout = stdout.replace('\\node_modules\\prettier\\', '\\');
  }

  expect(stdout).not.toMatch(/flow-typed/);
  expect(stdout).not.toMatch(/node_modules/);
});

test('npmScript() versus empty package.json', async () => {
  const pkg = {};
  require('update-json-file').__setPackage(pkg);

  await npmScript('some/path');

  expect(pkg).toMatchSnapshot();
});
