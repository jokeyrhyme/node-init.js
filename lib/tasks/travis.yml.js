/* @flow */
'use strict'

const path = require('path')

const { safeDump, safeLoad } = require('js-yaml')
const semver = require('semver')
const union = require('lodash.union')

const { ensureArrayTail } = require('../data.js')
const fs = require('../fs.js')
const { getGitHubPath, getOriginUrl } = require('../git.js')

const LABEL = '.travis.yml initialised'

/* :: import type { TaskOptions } from '../index.js' */

function fn ({ cwd } /* : TaskOptions */) {
  const filePath = path.join(cwd, '.travis.yml')
  return getOriginUrl(cwd)
    .then(getGitHubPath)
    .then((githubPath) => {
      if (!githubPath) {
        return
      }
      return fs.touch(filePath)
        .then(() => fs.readFile(filePath, 'utf8'))
        .then(safeLoad)
        .then((cfg) => {
          cfg = cfg || {}
          cfg.language = cfg.language || 'node_js'
          cfg.sudo = cfg.sudo || false

          let majorVersion = '' + semver.major(process.version)
          cfg.node_js = cfg.node_js || []
          cfg.node_js = union(cfg.node_js, [ majorVersion ])

          cfg.env = cfg.env || {}
          cfg.env.global = cfg.env.global || []
          cfg.env.global = union(cfg.env.global, [ 'CXX=g++-4.8' ])

          cfg.addons = cfg.addons || {}
          cfg.addons.apt = cfg.addons.apt || {}
          cfg.addons.apt.sources = cfg.addons.apt.sources || []
          cfg.addons.apt.sources = union(cfg.addons.apt.sources, [ 'ubuntu-toolchain-r-test' ])
          cfg.addons.apt.packages = cfg.addons.apt.packages || []
          cfg.addons.apt.packages = union(cfg.addons.apt.packages, [ 'g++-4.8' ])

          cfg.cache = cfg.cache || {}
          cfg.cache.directories = cfg.cache.directories || []
          cfg.cache.directories = union(cfg.cache.directories, [ 'node_modules' ])

          cfg.install = cfg.install || []
          cfg.install = union(cfg.install, [
            'npm install --global npm',
            'npm install --global flow-typed',
            'npm install --global typings',
            'npm install --global yarn'
          ])
          cfg.install = ensureArrayTail(cfg.install, 'npm install')

          return safeDump(cfg)
        })
        .then((data) => fs.writeFile(filePath, data))
    })
}

module.exports = {
  fn,
  label: LABEL
}
