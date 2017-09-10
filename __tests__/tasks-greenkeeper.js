/* @flow */
'use strict';

const { pkgUpdater } = require('../lib/tasks/greenkeeper.js');

test('fresh package.json', () => {
  const result = pkgUpdater({ name: 'my-package', version: '1.2.3' });
  expect(result).toEqual({ name: 'my-package', version: '1.2.3' });
});

test('old package.json', () => {
  const result = pkgUpdater({
    name: 'my-package',
    version: '1.2.3',
    devDependencies: {
      'greenkeeper-postpublish': '1.2.3',
      something: '1.2.3',
    },
    scripts: {
      postpublish: 'greenkeeper-postpublish',
      test: 'exit 0',
    },
  });
  expect(result).toEqual({
    name: 'my-package',
    version: '1.2.3',
    devDependencies: {
      something: '1.2.3',
    },
    scripts: {
      test: 'exit 0',
    },
  });
});
