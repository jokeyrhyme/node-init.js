'use strict'

const execa = require('execa')

const MATCH_BB_HTTPS_REGEXP = /^https:\/\/[^@]+@bitbucket.org\/([^\/]+\/[^\/]+)\.git$/
const MATCH_BB_SSH_REGEXP = /^\w+@bitbucket.org:([^\/]+\/[^\/]+)\.git$/

function getBitbucketPath (remoteUrl) {
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

const MATCH_GH_HTTPS_REGEXP = /^https:\/\/github.com\/([^\/]+\/[^\/]+)\.git$/
const MATCH_GH_SSH_REGEXP = /^\w+@github.com:([^\/]+\/[^\/]+)\.git$/

function getGitHubPath (remoteUrl) {
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

function getOriginUrl (cwd) {
  return execa('git', ['remote', 'get-url', 'origin'], { cwd })
    .then((result) => result.stdout)
    .catch(() => '')
}

module.exports = {
  getBitbucketPath,
  getGitHubPath,
  getOriginUrl
}
