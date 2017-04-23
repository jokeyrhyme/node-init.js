/* @flow */
'use strict';

const os = require('os');

function withLine(text /* : string */, line /* : string */) /* : string */ {
  const regexp = new RegExp(`\s*${line}\s*`, 'm');
  if (!regexp.test(text)) {
    text += `${os.EOL}${line}${os.EOL}`;
  }
  return text;
}

module.exports = {
  withLine
};
