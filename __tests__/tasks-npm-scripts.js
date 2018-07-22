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

test('fn() versus package.json with ava and nyc', async () => {
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

test('fn() versus package.json with ava and pre-existing scripts', async () => {
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
