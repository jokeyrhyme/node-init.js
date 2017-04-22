/* @flow */
'use strict';

const fetch = require('node-fetch');
const pMemoize = require('p-memoize');
const { major, minSatisfying } = require('semver');

/* :: import type { NodejsVersion } from './types.js' */

function fetchVersions() /* : Promise<NodejsVersion[]> */ {
  const URL = 'https://nodejs.org/dist/index.json';
  return fetch(URL).then(res => res.json()).catch(() => []);
}

function* evenNumbers(min /* : number */, max /* : number */) {
  // ensure we're starting with an even number within range
  let next = Math.ceil(min);
  next += next % 2 === 0 ? 0 : 1;
  while (next <= max) {
    yield next;
    next += 2;
  }
}

function supportedMajors(
  range /* :? string */,
  versions /* : NodejsVersion[] */
) /* : number[] */ {
  const min = major(
    minSatisfying(
      versions.map(version => version.version),
      range || process.version
    )
  );
  const max = major(versions.length ? versions[0].version : process.version);
  const evens = Array.from(evenNumbers(min, max));
  return [
    ...evens,
    ...(max % 2 === 0 ? [] : [max]) // ensure latest is always included
  ];
}

function fetchSupportedMajors(range /* :? string */) {
  return fetchVersions().then(versions => supportedMajors(range, versions));
}

module.exports = {
  fetchSupportedMajors: pMemoize(fetchSupportedMajors),
  fetchVersions: pMemoize(fetchVersions),
  supportedMajors
};
