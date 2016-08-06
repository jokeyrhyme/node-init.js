/* @flow */
'use strict'

const path = require('path')

const { safeDump, safeLoad } = require('js-yaml')
const semver = require('semver')
const union = require('lodash.union')

const fs = require('../fs.js')
const { getBitbucketPath, getGitHubPath, getOriginUrl } = require('../git.js')

const LABEL = 'appveyor.yml initialised'

/* :: import type { TaskOptions } from '../index.js' */

function fn ({ cwd } /* : TaskOptions */) {
  const filePath = path.join(cwd, 'appveyor.yml')
  return getOriginUrl(cwd)
    .then((remoteUrl) => getGitHubPath(remoteUrl) || getBitbucketPath(remoteUrl))
    .then((publicPath) => {
      if (!publicPath) {
        return // AppVeyor only works for GitHub and Bitbucket
      }
      return fs.touch(filePath)
        .then(() => fs.readFile(filePath, 'utf8'))
        .then(safeLoad)
        .then((cfg) => {
          cfg = cfg || {}
          cfg.build = cfg.build || 'off'

          let majorVersion = '' + semver.major(process.version)
          cfg.environment = cfg.environment || {}
          cfg.environment.matrix = cfg.environment.matrix || []
          if (cfg.environment.matrix.every((env) => {
            return env.nodejs_version !== majorVersion
          })) {
            cfg.environment.matrix.push({ nodejs_version: majorVersion })
          }

          cfg.install = cfg.install || []
          if (cfg.install.every((step) => {
            return step.ps !== 'Install-Product node $env:nodejs_version'
          })) {
            cfg.install.push({ ps: 'Install-Product node $env:nodejs_version' })
          }
          if (cfg.install.every((step) => {
            return step !== 'npm install'
          })) {
            cfg.install.push('npm install')
          }

          cfg.test_script = cfg.test_script || []
          cfg.test_script = union(cfg.test_script, [
            'node --version',
            'npm --version',
            'npm test'
          ])

          cfg.cache = cfg.cache || []
          cfg.cache = union(cfg.cache, [ 'node_modules' ])

          return safeDump(cfg)
        })
        .then((data) => fs.writeFile(filePath, data))
    })
}

module.exports = {
  fn,
  label: LABEL
}
