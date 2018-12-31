'use strict';

jest.unmock('execa');

const { mkdtemp } = require('fs');
const os = require('os');
const path = require('path');
const { promisify } = require('util');

const pify = require('pify');
const rimraf = require('rimraf');

const {
  getBitbucketPath,
  getGitHubPath,
  getOriginUrl,
  init,
  isGitClean,
  isGitProject,
} = require('../lib/git.js');

let tempDir;

beforeEach(async () => {
  tempDir = await promisify(mkdtemp)(path.join(os.tmpdir(), 'node-init-'));
});

afterEach(async () => {
  await pify(rimraf)(tempDir);
});

test('getOriginUrl(cwd) in this project', () =>
  getOriginUrl(__dirname).then(remoteUrl => {
    // skip assertions during CI, as they'll fail there :S
    if (!process.env.CI) {
      expect(remoteUrl).toBeTruthy();
      expect(typeof remoteUrl).toBe('string');
      expect(remoteUrl.includes('github.com')).toBeTruthy();
    }
  }));

const getBitbucketPathData = [
  { args: [''], expected: '' },
  {
    args:     ['git@bitbucket.org:username/project.git'],
    expected: 'username/project',
  },
  {
    args:     ['https://username@bitbucket.org/username/project.git'],
    expected: 'username/project',
  },
];

getBitbucketPathData.forEach(d =>
  test(`getBitbucketPath(${JSON.stringify(d.args)})`, () =>
    expect(getBitbucketPath(...d.args)).toBe(d.expected)),
);

const getGitHubPathData = [
  { args: [''], expected: '' },
  {
    args:     ['git@github.com:username/project.git'],
    expected: 'username/project',
  },
  {
    args:     ['https://github.com/username/project.git'],
    expected: 'username/project',
  },
];

getGitHubPathData.forEach(d =>
  test(`getGitHubPath(${JSON.stringify(d.args)})`, () =>
    expect(getGitHubPath(...d.args)).toBe(d.expected)),
);

test('isGitProject(__dirname) is true', async () => {
  const result = await isGitProject(__dirname);
  expect(result).toBe(true);
});

test('isGitProject(tempDir) is false', async () => {
  const result = await isGitProject(tempDir);
  expect(result).toBe(false);
});

test('init(tempDir) then isGitProject(tempDir) is true', async () => {
  await init(tempDir);
  const result = await isGitProject(tempDir);
  expect(result).toBe(true);
});

test('init(tempDir) then isGitClean(tempDir) is true', async () => {
  await init(tempDir);
  const result = await isGitClean(tempDir);
  expect(result).toBe(true);
});
