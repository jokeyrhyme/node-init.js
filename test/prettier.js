'use strict';

const os = require('os');

const execa = require('execa');
const test = require('ava');

test('`npm run prettier` finds correct files', async t => {
  let { stdout } = await execa('npm', [
    'run',
    'prettier',
    '--',
    '--no-list-different'
  ]);

  t.regex(stdout, /test\/prettier\.js/);

  // output on Windows includes the full path to prettier
  // so we have to strip it before the next assertion
  if (/^win/.test(os.platform())) {
    stdout = stdout.replace('\\node_modules\\prettier\\', '\\');
  }

  t.notRegex(stdout, /node_modules/);
});
