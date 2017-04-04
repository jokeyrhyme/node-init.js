/* @flow */
'use strict'

const path = require('path')

const { safeDump, safeLoad } = require('js-yaml')
const readPkgUp = require('read-pkg-up')
const union = require('lodash.union')
const without = require('lodash.without')

const { ensureArrayTail } = require('../data.js')
const fs = require('../fs.js')
const { getOriginUrl, isPublicGitHub } = require('../git.js')
const { fetchSupportedMajors } = require('../nodejs-versions.js')
const { GIT_REPO, PACKAGE_JSON } = require('../values.js')

const LABEL = '.travis.yml initialised'

/* :: import type { TaskOptions } from '../types.js' */

function pruneCache (cfg /* : Object */) /* : Object */ {
  // anything to do with npm's cache is likely to cause EPERMs
  cfg.cache = without(cfg.cache || [], 'node_modules')

  cfg.cache = cfg.cache || {}
  cfg.cache.directories = without(
    cfg.cache.directories || [],
    'node_modules'
  )

  // remove completely if empty
  if (!cfg.cache.directories.length) {
    delete cfg.cache.directories
  }
  if (!Object.keys(cfg.cache).length) {
    delete cfg.cache
  }

  return cfg
}

function pruneInstall (cfg /* : Object */) /* : Object */ {
  // was never a good idea to install types definitions on-the-fly
  cfg.install = without(
    cfg.install || [],
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

function updateNpm (cfg /* : Object */) /* : Object */ {
  cfg.install = union(cfg.install || [], [
    'npm install --global npm',
    'npm install --global yarn'
  ])

  return cfg
}

function fn ({ cwd } /* : TaskOptions */) {
  const filePath = path.join(cwd, '.travis.yml')
  return Promise.all([
    getOriginUrl(cwd),
    readPkgUp({ cwd })
      .then(({ pkg }) => fetchSupportedMajors((pkg.engines || {}).node))
  ])
    .then(([ originUrl, majors ]) => {
      return fs.touch(filePath)
        .then(() => fs.readFile(filePath, 'utf8'))
        .then(safeLoad)
        .then((cfg) => {
          cfg = cfg || {}
          cfg.language = cfg.language || 'node_js'
          cfg.sudo = cfg.sudo || false

          cfg.node_js = cfg.node_js || []
          cfg.node_js = union(cfg.node_js, majors.map((major) => '' + major))

          cfg.env = cfg.env || {}
          cfg.env.global = cfg.env.global || []
          cfg.env.global = union(cfg.env.global, [ 'CXX=g++-4.8' ])

          cfg.addons = cfg.addons || {}
          cfg.addons.apt = cfg.addons.apt || {}
          cfg.addons.apt.sources = cfg.addons.apt.sources || []
          cfg.addons.apt.sources = union(cfg.addons.apt.sources, [ 'ubuntu-toolchain-r-test' ])
          cfg.addons.apt.packages = cfg.addons.apt.packages || []
          cfg.addons.apt.packages = union(cfg.addons.apt.packages, [ 'g++-4.8' ])

          cfg = updateNpm(cfg)

          cfg.install = ensureArrayTail(cfg.install || [], 'npm install')

          cfg = pruneInstall(cfg)
          cfg = pruneCache(cfg)

          return safeDump(cfg)
        })
        .then((data) => fs.writeFile(filePath, data))
    })
}

function isNeeded ({ cwd } /* : TaskOptions */) {
  // free Travis CI requires public GitHub hosting
  return isPublicGitHub(cwd)
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  requires: [ GIT_REPO, PACKAGE_JSON ]
}
