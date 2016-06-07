'use strict'

const execa = require('execa')

const MATCH_HTTPS_REGEXP = /^https:\/\/[^\/]+\/([^\/]+\/[^\/]+)\.git$/
const MATCH_SSH_REGEXP = /^\w+@[^:]+:([^\/]+\/[^\/]+)\.git$/

function getGitHubPath (remoteUrl) {
  let githubPath
  [ , githubPath ] = remoteUrl.match(MATCH_HTTPS_REGEXP) || []
  if (githubPath) {
    return githubPath
  }
  [ , githubPath ] = remoteUrl.match(MATCH_SSH_REGEXP) || []
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
  getGitHubPath,
  getOriginUrl
}
