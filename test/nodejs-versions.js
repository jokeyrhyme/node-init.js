'use strict'

const test = require('ava')

const { fetchVersions, supportedMajors } = require('../lib/nodejs-versions.js')

test('fetchVersions()', async (t) => {
  const versions = await fetchVersions()
  t.true(Array.isArray(versions))
})

const versions20161019 = [
  { version: 'v6.9.1' },
  { version: 'v6.9.0' },
  { version: 'v5.0.0' },
  { version: 'v4.0.0' },
  { version: 'v3.0.0' },
  { version: 'v2.0.0' },
  { version: 'v1.0.0' }
]

const versions20161025 = [
  { version: 'v7.0.0' },
  ...versions20161019
]

const supportedMajorsData = [
  { range: '>=2', versions: versions20161019, expected: [ 2, 4, 6 ] },
  { range: '>=2', versions: versions20161025, expected: [ 2, 4, 6, 7 ] },
  { range: '>=4', versions: versions20161019, expected: [ 4, 6 ] },
  { range: '>=4', versions: versions20161025, expected: [ 4, 6, 7 ] }
]
supportedMajorsData.forEach(({ range, versions, expected }) => {
  const latestVersion = versions[0].version
  test(`supportedMajors() ${range} ${latestVersion}`, (t) => {
    t.deepEqual(supportedMajors(range, versions), expected)
  })
})
