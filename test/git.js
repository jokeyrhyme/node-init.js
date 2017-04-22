'use strict';

const os = require('os');
const path = require('path');

const fs = require('@jokeyrhyme/pify-fs');
const pify = require('pify');
const rimraf = require('rimraf');
const test = require('ava');

const {
  getBitbucketPath,
  getGitHubPath,
  getOriginUrl,
  init,
  isGitClean,
  isGitProject
} = require('../lib/git.js');

test.beforeEach(async t => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'node-init-'));
  t.context.tempDir = tempDir;
});

test.afterEach.always(async t => {
  await pify(rimraf)(t.context.tempDir);
});

test('getOriginUrl(cwd) in this project', t =>
  getOriginUrl(__dirname)
    .then(remoteUrl => {
      // skip assertions during CI, as they'll fail there :S
      if (!process.env.CI) {
        t.truthy(remoteUrl);
        t.is(typeof remoteUrl, 'string');
        t.truthy(remoteUrl.includes('github.com'));
      }
    })
    .then(() => t.pass()));

const getBitbucketPathData = [
  { args: [''], expected: '' },
  {
    args: ['git@bitbucket.org:username/project.git'],
    expected: 'username/project'
  },
  {
    args: ['https://username@bitbucket.org/username/project.git'],
    expected: 'username/project'
  }
];

getBitbucketPathData.forEach(d =>
  test(`getBitbucketPath(${JSON.stringify(d.args)})`, t =>
    t.is(getBitbucketPath(...d.args), d.expected))
);

const getGitHubPathData = [
  { args: [''], expected: '' },
  {
    args: ['git@github.com:username/project.git'],
    expected: 'username/project'
  },
  {
    args: ['https://github.com/username/project.git'],
    expected: 'username/project'
  }
];

getGitHubPathData.forEach(d =>
  test(`getGitHubPath(${JSON.stringify(d.args)})`, t =>
    t.is(getGitHubPath(...d.args), d.expected))
);

test('isGitProject(__dirname) is true', async t => {
  const result = await isGitProject(__dirname);
  t.is(result, true);
});

test('isGitProject(tempDir) is false', async t => {
  const result = await isGitProject(t.context.tempDir);
  t.is(result, false);
});

test('init(tempDir) then isGitProject(tempDir) is true', async t => {
  await init(t.context.tempDir);
  const result = await isGitProject(t.context.tempDir);
  t.is(result, true);
});

test('init(tempDir) then isGitClean(tempDir) is true', async t => {
  await init(t.context.tempDir);
  const result = await isGitClean(t.context.tempDir);
  t.is(result, true);
});
