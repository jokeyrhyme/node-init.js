'use strict'

const path = require('path')

const { safeDump, safeLoad } = require('js-yaml')
const semver = require('semver')

const fs = require('../fs.js')
const { getGitHubPath, getOriginUrl } = require('../git.js')

const LABEL = '.travis.yml initialised'

function fn ({ cwd }) {
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
          if (!cfg.node_js.includes(majorVersion)) {
            cfg.node_js.push(majorVersion)
          }

          cfg.env = cfg.env || {}
          cfg.env.global = cfg.env.global || []
          if (!cfg.env.global.includes('CXX=g++-4.8')) {
            cfg.env.global.push('CXX=g++-4.8')
          }

          cfg.addons = cfg.addons || {}
          cfg.addons.apt = cfg.addons.apt || {}
          cfg.addons.apt.sources = cfg.addons.apt.sources || []
          if (!cfg.addons.apt.sources.includes('ubuntu-toolchain-r-test')) {
            cfg.addons.apt.sources.push('ubuntu-toolchain-r-test')
          }
          cfg.addons.apt.packages = cfg.addons.apt.packages || []
          if (!cfg.addons.apt.packages.includes('g++-4.8')) {
            cfg.addons.apt.packages.push('g++-4.8')
          }

          cfg.cache = cfg.cache || {}
          cfg.cache.directories = cfg.cache.directories || []
          if (!cfg.cache.directories.includes('node_modules')) {
            cfg.cache.directories.push('node_modules')
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
