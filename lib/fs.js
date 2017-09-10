/* @flow */
'use strict';

const { access, readFile, writeFile } = require('fs');
// $FlowFixMe: util.promisify is tricky to define :(
const { promisify } = require('util');

const fetch = require('node-fetch');

async function copyFile(
  src /* : string */,
  dest /* : string */
) /* : Promise<void> */ {
  const data = await promisify(readFile)(src);
  await promisify(writeFile)(dest, data);
}

async function fetchFile(
  filePath /* : string */,
  fetchUrl /* : string */
) /* : Promise<void> */ {
  const data = await (await fetch(fetchUrl)).text();
  await promisify(writeFile)(filePath, data);
}

async function touch(filePath /* : string */) /* : Promise<void> */ {
  try {
    await promisify(access)(filePath);
  } catch (err) {
    await promisify(writeFile)(filePath, '');
  }
}

module.exports = {
  copyFile,
  fetchFile,
  touch,
};
