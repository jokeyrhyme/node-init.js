/* @flow */
'use strict'

const path = require('path')

const { safeDump, safeLoad } = require('js-yaml')
const semver = require('semver')
const union = require('lodash.union')
const without = require('lodash.without')

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

          // fix any non-64-bit Node.js install steps
          cfg.install = cfg.install.map((step) => {
            if (step.ps === 'Install-Product node $env:nodejs_version') {
              return {
                ps: 'Install-Product node $env:nodejs_version x64'
              }
            }
            return step
          })

          if (cfg.install.every((step) => {
            return step.ps !== 'Install-Product node $env:nodejs_version x64'
          })) {
            cfg.install.push({ ps: 'Install-Product node $env:nodejs_version x64' })
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

          // anything to do with npm's cache is likely to cause EPERMs
          cfg.install = without(cfg.install, 'npm cache clean')
          cfg.test_script = without(cfg.test_script, 'npm cache clean')

          if (Array.isArray(cfg.cache)) {
            cfg.cache = without(cfg.cache, 'node_modules')
          }

          return safeDump(cfg)
        })
        .then((data) => fs.writeFile(filePath, data))
    })
}

module.exports = {
  fn,
  label: LABEL
}
