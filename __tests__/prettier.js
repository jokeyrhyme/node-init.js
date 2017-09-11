'use strict';

const os = require('os');

const execa = require('execa');

const FIFTEEN_SECONDS = 15 * 1e3;
jest.setTimeout(FIFTEEN_SECONDS);

test('`npm run prettier` finds correct files', async () => {
  let { stdout } = await execa('npm', [
    'run',
    'prettier',
    '--',
    '--no-list-different',
  ]);

  expect(stdout).toMatch(/__tests__\/prettier\.js/);

  // output on Windows includes the full path to prettier
  // so we have to strip it before the next assertion
  if (/^win/.test(os.platform())) {
    stdout = stdout.replace('\\node_modules\\prettier\\', '\\');
  }

  expect(stdout).not.toMatch(/node_modules/);
});
