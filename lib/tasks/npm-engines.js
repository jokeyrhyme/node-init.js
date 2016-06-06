'use strict'

const path = require('path')

const execa = require('execa')
const semver = require('semver')

const updateJson = require('../json.js').updateJson

const LABEL = '"engines" set in package.json'

function fn ({ cwd }) {
    let node, npm
    return Promise.all([
        execa('node', [ '--version' ]),
        execa('npm', [ '--version' ]),
    ])
        .then((versions) => {
            node = semver.major(versions[0].stdout)
            npm = semver.major(versions[1].stdout)
        })
        .then(() => updateJson(
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
