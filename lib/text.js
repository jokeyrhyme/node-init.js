/* @flow */
'use strict';

const os = require('os');

function withBadge(text /* : string */, badge /* : string */) /* : string */ {
  if (!text.includes(badge)) {
    const lines = text.split(os.EOL);
    lines[0] += ` ${badge}`;
    text = lines.join(os.EOL);
  }
  return text;
}

function withLine(text /* : string */, line /* : string */) /* : string */ {
  const regexp = new RegExp(`\\s*${line}\\s*`, 'm');

  // convert to UNIX line-endings
  text = text.replace(/\r\n/g, '\n');

  if (!regexp.test(text)) {
    text += `\n${line}\n`;
  }
  return text;
}

module.exports = {
  withBadge,
  withLine,
};
