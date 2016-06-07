'use strict'

const path = require('path')

const execa = require('execa')
const semver = require('semver')

const updateJson = require('../json.js').updateJson

const LABEL = '"engines" set in package.json'

function fn ({ cwd }) {
  const node = semver.major(process.version)
  return execa('npm', [ '--version' ])
    .then((result) => semver.major(result.stdout))
    .then((npm) => updateJson(
      path.join(cwd, 'package.json'),
      (pkg) => {
        pkg.engines = pkg.engines || {}
        pkg.engines.node = pkg.engines.node || `>=${node}`
        pkg.engines.npm = pkg.engines.npm || `>=${npm}`
        return pkg
      }
    ))
}

module.exports = {
  fn,
  label: LABEL
}
