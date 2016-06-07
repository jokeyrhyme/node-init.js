'use strict'

const test = require('ava')

const { getGitHubPath, getOriginUrl } = require('../lib/git.js')

test('getOriginUrl(cwd) in this project', (t) => getOriginUrl(__dirname)
  .then((remoteUrl) => {
    t.truthy(remoteUrl)
    t.is(typeof remoteUrl, 'string')
    t.truthy(remoteUrl.includes('github.com'))
  }))

const getGitHubPathData = [
  { args: [''], expected: '' },
  { args: ['git@github.com:username/project.git'], expected: 'username/project' },
  { args: ['https://github.com/username/project.git'], expected: 'username/project' }
]

getGitHubPathData.forEach((d) => test(
  `getGitHubPath(${JSON.stringify(d.args)})`,
  (t) => t.is(getGitHubPath(...d.args), d.expected)
))
