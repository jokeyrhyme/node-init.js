/* @flow */
'use strict'

const path = require('path')

const { safeDump, safeLoad } = require('js-yaml')
const readPkgUp = require('read-pkg-up')
const union = require('lodash.union')
const without = require('lodash.without')

const { ensureArrayTail } = require('../data.js')
const fs = require('../fs.js')
const { getGitHubPath, getOriginUrl } = require('../git.js')
const { fetchSupportedMajors } = require('../nodejs-versions.js')
const { GIT_REPO, PACKAGE_JSON } = require('../values.js')

const LABEL = '.travis.yml initialised'

/* :: import type { TaskOptions } from '../types.js' */

function fn ({ cwd } /* : TaskOptions */) {
  const filePath = path.join(cwd, '.travis.yml')
  return Promise.all([
    getOriginUrl(cwd),
    readPkgUp()
      .then(({ pkg }) => fetchSupportedMajors((pkg.engines || {}).node))
  ])
    .then(([ originUrl, majors ]) => {
      const githubPath = getGitHubPath(originUrl)
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

          cfg.cache = cfg.cache || {}
          cfg.cache.directories = cfg.cache.directories || []
          cfg.cache.directories = without(cfg.cache.directories, 'node_modules')
          if (!cfg.cache.directories.length) {
            delete cfg.cache.directories
          }
          if (!Object.keys(cfg.cache).length) {
            delete cfg.cache
          }

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
  id: path.basename(__filename),
  label: LABEL,
  requires: [ GIT_REPO, PACKAGE_JSON ]
}
