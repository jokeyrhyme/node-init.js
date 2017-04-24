/* @flow */
'use strict';

function withLine(text /* : string */, line /* : string */) /* : string */ {
  const regexp = new RegExp(`\s*${line}\s*`, 'm');

  // convert to UNIX line-endings
  text = text.replace(/\r\n/g, '\n');

  if (!regexp.test(text)) {
    text += `\n${line}\n`;
  }
  return text;
}

module.exports = {
  withLine
};
