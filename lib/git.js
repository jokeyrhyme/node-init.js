/* @flow */
'use strict';

const execa = require('execa');

const MATCH_BB_HTTPS_REGEXP = /^https:\/\/[^@]+@bitbucket.org\/([^/]+\/[^/]+)\.git$/;
const MATCH_BB_SSH_REGEXP = /^\w+@bitbucket.org:([^/]+\/[^/]+)\.git$/;

function getBitbucketPath(remoteUrl /* : string */) {
  let bbPath;
  [, bbPath] = remoteUrl.match(MATCH_BB_HTTPS_REGEXP) || [];
  if (bbPath) {
    return bbPath;
  }
  [, bbPath] = remoteUrl.match(MATCH_BB_SSH_REGEXP) || [];
  if (bbPath) {
    return bbPath;
  }
  return '';
}

const MATCH_GH_HTTPS_REGEXP = /^https:\/\/github.com\/([^/]+\/[^/]+)\.git$/;
const MATCH_GH_SSH_REGEXP = /^\w+@github.com:([^/]+\/[^/]+)\.git$/;

function getGitHubPath(remoteUrl /* : string */) {
  let githubPath;
  [, githubPath] = remoteUrl.match(MATCH_GH_HTTPS_REGEXP) || [];
  if (githubPath) {
    return githubPath;
  }
  [, githubPath] = remoteUrl.match(MATCH_GH_SSH_REGEXP) || [];
  if (githubPath) {
    return githubPath;
  }
  return '';
}

async function getOriginUrl(cwd /* : string */) /* : Promise<string> */ {
  try {
    const { stdout } = await execa('git', ['remote', 'get-url', 'origin'], {
      cwd,
    });
    return stdout;
  } catch (err) {
    return '';
  }
}

async function isGitProject(cwd /* : string */) /* : Promise<boolean> */ {
  try {
    await execa('git', ['status'], { cwd });
    return true;
  } catch (err) {
    return false;
  }
}

async function init(cwd /* : string */) /* : Promise<any> */ {
  const isDone = await isGitProject(cwd);
  if (!isDone) {
    return await execa('git', ['init'], { cwd });
  }
}

async function isGitClean(cwd /* : string */) /* : Promise<boolean> */ {
  const result = await isGitProject(cwd);
  if (!result) {
    return true;
  }
  // https://github.com/sindresorhus/pure/blob/291574e6/pure.zsh#L253
  const { stdout = '' } = await execa(
    'git',
    ['status', '--porcelain', '--ignore-submodules', '-unormal'],
    { cwd }
  );
  return !stdout.trim();
}

async function isPublicGitHub(cwd /* : string */) /* : Promise<boolean> */ {
  const origin = await getOriginUrl(cwd);
  return !!(await getGitHubPath(origin));
}

async function isPublicGitHubOrBitbucket(
  cwd /* : string */
) /* : Promise<boolean> */ {
  const origin = await getOriginUrl(cwd);
  return !!((await getGitHubPath(origin)) || (await getBitbucketPath(origin)));
}

module.exports = {
  getBitbucketPath,
  getGitHubPath,
  getOriginUrl,
  init,
  isGitClean,
  isGitProject,
  isPublicGitHub,
  isPublicGitHubOrBitbucket,
};
