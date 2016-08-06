/* @flow */
'use strict'

const test = require('ava')

const {
  getBitbucketPath, getGitHubPath, getOriginUrl
} = require('../lib/git.js')

test('getOriginUrl(cwd) in this project', (t) => getOriginUrl(__dirname)
  .then((remoteUrl) => {
    // skip assertions during CI, as they'll fail there :S
    if (!process.env.CI) {
      t.truthy(remoteUrl)
      t.is(typeof remoteUrl, 'string')
      t.truthy(remoteUrl.includes('github.com'))
    }
  }))

const getBitbucketPathData = [
  { args: [''], expected: '' },
  { args: ['git@bitbucket.org:username/project.git'], expected: 'username/project' },
  { args: ['https://username@bitbucket.org/username/project.git'], expected: 'username/project' }
]

getBitbucketPathData.forEach((d) => test(
  `getBitbucketPath(${JSON.stringify(d.args)})`,
  (t) => t.is(getBitbucketPath(...d.args), d.expected)
))

const getGitHubPathData = [
  { args: [''], expected: '' },
  { args: ['git@github.com:username/project.git'], expected: 'username/project' },
  { args: ['https://github.com/username/project.git'], expected: 'username/project' }
]

getGitHubPathData.forEach((d) => test(
  `getGitHubPath(${JSON.stringify(d.args)})`,
  (t) => t.is(getGitHubPath(...d.args), d.expected)
))
