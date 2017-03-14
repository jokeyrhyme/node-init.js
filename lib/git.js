/* @flow */
'use strict'

const execa = require('execa')

const MATCH_BB_HTTPS_REGEXP = /^https:\/\/[^@]+@bitbucket.org\/([^/]+\/[^/]+)\.git$/
const MATCH_BB_SSH_REGEXP = /^\w+@bitbucket.org:([^/]+\/[^/]+)\.git$/

function getBitbucketPath (remoteUrl /* : string */) {
  let bbPath
  [ , bbPath ] = remoteUrl.match(MATCH_BB_HTTPS_REGEXP) || []
  if (bbPath) {
    return bbPath
  }
  [ , bbPath ] = remoteUrl.match(MATCH_BB_SSH_REGEXP) || []
  if (bbPath) {
    return bbPath
  }
  return ''
}

const MATCH_GH_HTTPS_REGEXP = /^https:\/\/github.com\/([^/]+\/[^/]+)\.git$/
const MATCH_GH_SSH_REGEXP = /^\w+@github.com:([^/]+\/[^/]+)\.git$/

function getGitHubPath (remoteUrl /* : string */) {
  let githubPath
  [ , githubPath ] = remoteUrl.match(MATCH_GH_HTTPS_REGEXP) || []
  if (githubPath) {
    return githubPath
  }
  [ , githubPath ] = remoteUrl.match(MATCH_GH_SSH_REGEXP) || []
  if (githubPath) {
    return githubPath
  }
  return ''
}

function getOriginUrl (cwd /* : string */) {
  return execa('git', ['remote', 'get-url', 'origin'], { cwd })
    .then((result) => result.stdout)
    .catch(() => '')
}

function isGitProject (cwd /* : string */) /* : Promise<boolean> */ {
  return execa('git', ['status'], { cwd })
    .then(() => true)
    .catch(() => false)
}

module.exports = {
  getBitbucketPath,
  getGitHubPath,
  getOriginUrl,
  isGitProject
}
