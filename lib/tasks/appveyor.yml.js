/* @flow */
'use strict'

const path = require('path')

const { safeDump, safeLoad } = require('js-yaml')
const readPkgUp = require('read-pkg-up')
const union = require('lodash.union')
const without = require('lodash.without')

const { ensureArrayTail } = require('../data.js')
const fs = require('../fs.js')
const {
  getBitbucketPath, getGitHubPath, getOriginUrl,
  isPublicGitHubOrBitbucket
} = require('../git.js')
const { fetchSupportedMajors } = require('../nodejs-versions.js')
const { GIT_REPO, PACKAGE_JSON } = require('../values.js')

const LABEL = 'appveyor.yml initialised'

/* :: import type { TaskOptions } from '../types.js' */

function pruneCache (cfg /* : Object */) /* : Object */ {
  // anything to do with npm's cache is likely to cause EPERMs
  cfg.cache = without(cfg.cache || [], 'node_modules')

  // remove completely if empty
  if (!cfg.cache.length) {
    delete cfg.cache
  }

  return cfg
}

function pruneInstall (cfg /* : Object */) /* : Object */ {
  // was never a good idea to install types definitions on-the-fly
  cfg.install = without(
    cfg.install || [],
    'npm install --global npm',
    'npm install --global flow-typed',
    'npm install --global typings'
  )

  // anything to do with npm's cache is likely to cause EPERMs
  cfg.install = without(
    cfg.install || [],
    'npm cache clean'
  )

  // remove completely if empty
  if (!cfg.install.length) {
    delete cfg.install
  }

  return cfg
}

function updateNodeNpm (cfg /* : Object */) /* : Object */ {
  // fix any non-64-bit Node.js install steps
  cfg.install = (cfg.install || []).map((step) => {
    if (step.ps === 'Install-Product node $env:nodejs_version') {
      return {
        ps: 'Install-Product node $env:nodejs_version x64'
      }
    }
    return step
  })

  // ensure 64-bit Node.js version from matrix is installed
  if (cfg.install.every((step) => {
    return step.ps !== 'Install-Product node $env:nodejs_version x64'
  })) {
    cfg.install.unshift({ ps: 'Install-Product node $env:nodejs_version x64' })
  }

  cfg.install = union(cfg.install || [], [
    'npm install --global npm-windows-upgrade',
    'npm-windows-upgrade --no-spinner --npm-version latest',
    'npm install --global yarn'
  ])

  return cfg
}

function fn ({ cwd } /* : TaskOptions */) {
  const filePath = path.join(cwd, 'appveyor.yml')
  return getOriginUrl(cwd)
    .then((origin) => getGitHubPath(origin) || getBitbucketPath(origin))
    .then((publicPath) => {
      return fs.touch(filePath)
        .then(() => fs.readFile(filePath, 'utf8'))
        .then((contents) => Promise.all([
          safeLoad(contents),
          readPkgUp({ cwd })
            .then(({ pkg }) => fetchSupportedMajors((pkg.engines || {}).node))
        ]))
        .then(([ cfg, majors ]) => {
          cfg = cfg || {}
          cfg.build = cfg.build || 'off'

          cfg.environment = cfg.environment || {}
          cfg.environment.matrix = cfg.environment.matrix || []
          majors.forEach((major) => {
            if (cfg.environment.matrix.every((env) => {
              return env.nodejs_version !== '' + major
            })) {
              cfg.environment.matrix.push({ nodejs_version: '' + major })
            }
          })

          cfg = updateNodeNpm(cfg)

          cfg.install = ensureArrayTail(cfg.install, 'npm install')

          cfg.test_script = cfg.test_script || []
          cfg.test_script = union(cfg.test_script, [
            'node --version',
            'npm --version',
            'npm test'
          ])

          // anything to do with npm's cache is likely to cause EPERMs
          cfg.test_script = without(cfg.test_script, 'npm cache clean')

          cfg = pruneInstall(cfg)
          cfg = pruneCache(cfg)

          return safeDump(cfg)
        })
        .then((data) => fs.writeFile(filePath, data))
    })
}

function isNeeded ({ cwd } /* : TaskOptions */) {
  // free AppVeyor requires public GitHub / Bitbucket hosting
  return isPublicGitHubOrBitbucket(cwd)
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  requires: [ GIT_REPO, PACKAGE_JSON ]
}
