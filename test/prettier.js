'use strict';

const execa = require('execa');
const test = require('ava');

test('`npm run prettier` finds correct files', async t => {
  const result = await execa('npm', [
    'run',
    'prettier',
    '--',
    '--no-list-different'
  ]);
  t.regex(result.stdout, /test\/prettier\.js/);
  t.notRegex(result.stdout, /node_modules/);
});
