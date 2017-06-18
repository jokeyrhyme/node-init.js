'use strict';

const test = require('ava');

const { withBadge, withLine } = require('../lib/text.js');

test('withBadge', t => {
  t.snapshot(withBadge('', '[badge](https://github.com)'));
  t.snapshot(withBadge('# name', '[badge](https://github.com)'));
});

test('withLine()', t => {
  const text = `
checkexisting
  checkwhitespace
check-hyphen
`;

  t.snapshot(withLine(text, 'checkexisting'));
  t.snapshot(withLine(text, 'checkwhitespace'));
  t.snapshot(withLine(text, 'check-hyphen'));
  t.snapshot(withLine(text, 'checkmissing'));
});
