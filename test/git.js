'use strict'

const test = require('ava')

const {
  getBitbucketPath, getGitHubPath, getOriginUrl
} = require('../lib/git.js')

test('getOriginUrl(cwd) in this project', (t) => getOriginUrl(__dirname)
  .then((remoteUrl) => {
    t.truthy(remoteUrl)
    t.is(typeof remoteUrl, 'string')
    t.truthy(remoteUrl.includes('github.com'))
  })
  .catch((err) => {
    if (!process.env.CI) {
      throw err
    }
    // swallow the error during CI, where it normally fails
  })
)

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
