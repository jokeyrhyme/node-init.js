/* @flow */
'use strict'

const test = require('ava')

const { pkgUpdater } = require('../lib/tasks/greenkeeper.js')

test('fresh package.json', (t) => {
  const result = pkgUpdater({ name: 'my-package', version: '1.2.3' })
  t.deepEqual(result, { name: 'my-package', version: '1.2.3' })
})

test('old package.json', (t) => {
  const result = pkgUpdater({
    name: 'my-package',
    version: '1.2.3',
    devDependencies: {
      'greenkeeper-postpublish': '1.2.3',
      something: '1.2.3'
    },
    scripts: {
      postpublish: 'greenkeeper-postpublish',
      test: 'exit 0'
    }
  })
  t.deepEqual(result, {
    name: 'my-package',
    version: '1.2.3',
    devDependencies: {
      something: '1.2.3'
    },
    scripts: {
      test: 'exit 0'
    }
  })
})
