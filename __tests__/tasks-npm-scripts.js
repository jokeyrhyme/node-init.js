'use strict';

jest.mock('update-json-file');

const { fn } = require('../lib/tasks/npm-scripts.js');

const TEN_SECONDS = 10 * 1e3;
jest.setTimeout(TEN_SECONDS);

test('fn() versus empty package.json', async () => {
  const pkg = {};
  require('update-json-file').__setPackage(pkg);

  await fn({ cwd: 'some/path' });

  expect(pkg).toMatchSnapshot();
});

test('fn() versus engines.node >= 8', async () => {
  const pkg = {
    engines: { node: '>=8' },
  };
  require('update-json-file').__setPackage(pkg);

  await fn({ cwd: 'some/path' });

  expect(pkg).toMatchSnapshot();
});

test('fn() with ava and nyc', async () => {
  const pkg = {
    devDependencies: {
      ava: '*',
      nyc: '*',
    },
  };
  require('update-json-file').__setPackage(pkg);

  await fn({ cwd: 'some/path' });

  expect(pkg).toMatchSnapshot();
});

test('fn() with ava and pre-existing scripts', async () => {
  const pkg = {
    devDependencies: {
      ava: '*',
    },
    scripts: {
      test: 'true',
    },
  };
  require('update-json-file').__setPackage(pkg);

  await fn({ cwd: 'some/path' });

  expect(pkg).toMatchSnapshot();
});

test('fn() versus empty package.json in Flow project', async () => {
  const pkg = {};
  require('update-json-file').__setPackage(pkg);

  await fn({ cwd: 'some/path', isFlowProject: true });

  expect(pkg).toMatchSnapshot();
});

test('fn() with jest and pre-existing settings', async () => {
  const pkg = {
    devDependencies: {
      jest: '*',
    },
    jest: {
      coverageThreshold: {
        global: {
          lines: 50,
        },
      },
    },
  };
  require('update-json-file').__setPackage(pkg);

  await fn({ cwd: 'some/path' });

  expect(pkg).toMatchSnapshot();
});

test('fn() with postpublish', async () => {
  const pkg = {
    scripts: {
      postpublish: 'true',
    },
  };
  require('update-json-file').__setPackage(pkg);

  await fn({ cwd: 'some/path' });

  expect(pkg).toMatchSnapshot();
});

test('fn() with postpublish (old greenkeeper)', async () => {
  const pkg = {
    scripts: {
      postpublish: 'greenkeeper-postpublish',
    },
  };
  require('update-json-file').__setPackage(pkg);

  await fn({ cwd: 'some/path' });

  expect(pkg).toMatchSnapshot();
});
