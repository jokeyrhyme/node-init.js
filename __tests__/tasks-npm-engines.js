'use strict';

jest.mock('process');
global.process = require('process');

jest.mock('execa');
jest.mock('update-json-file');

const { fn } = require('../lib/tasks/npm-engines.js');

const TEN_SECONDS = 10 * 1e3;
jest.setTimeout(TEN_SECONDS);

test('fn() versus empty package.json, new Node.js, new npm', async () => {
  process.version = '8.12.0';
  const pkg = {};
  const result = { stdout: '6.4.1' };
  require('execa').__setResult(result);
  require('update-json-file').__setPackage(pkg);

  await fn({ cwd: 'some/path' });

  expect(pkg).toMatchSnapshot();
});

test('fn() versus empty package.json, old Node.js, old npm', async () => {
  process.version = '8.8.1';
  const pkg = {};
  const result = { stdout: '5.4.2' };
  require('execa').__setResult(result);
  require('update-json-file').__setPackage(pkg);

  await fn({ cwd: 'some/path' });

  expect(pkg).toMatchSnapshot();
});

test('fn() versus package.json with old engines, new Node.js, new npm', async () => {
  process.version = '10.15.0';
  const pkg = {
    engines: {
      node: '>=10.10',
      npm:  '>=4',
    },
  };
  const result = { stdout: '6.4.1' };
  require('execa').__setResult(result);
  require('update-json-file').__setPackage(pkg);

  await fn({ cwd: 'some/path' });

  expect(pkg).toMatchSnapshot();
});
