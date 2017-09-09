'use strict';

const { withBadge, withLine } = require('../lib/text.js');

test('withBadge', () => {
  expect(withBadge('', '[badge](https://github.com)')).toMatchSnapshot();
  expect(withBadge('# name', '[badge](https://github.com)')).toMatchSnapshot();
});

test('withLine()', () => {
  const text = `
checkexisting
  checkwhitespace
check-hyphen
`;

  expect(withLine(text, 'checkexisting')).toMatchSnapshot();
  expect(withLine(text, 'checkwhitespace')).toMatchSnapshot();
  expect(withLine(text, 'check-hyphen')).toMatchSnapshot();
  expect(withLine(text, 'checkmissing')).toMatchSnapshot();
});
