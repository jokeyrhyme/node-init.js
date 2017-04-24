'use strict';

const test = require('ava');

const { withLine } = require('../lib/text.js');

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
