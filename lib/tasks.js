/* @flow */
'use strict'

/* :: import type { Flags, Task, TaskOptions } from './types.js' */

const appveyorYml = require('./tasks/appveyor.yml.js')
const badgeAppVeyor = require('./tasks/badge-appveyor.js')
const badgeNpm = require('./tasks/badge-npm.js')
const badgeTravis = require('./tasks/badge-travis.js')
const editorconfig = require('./tasks/editorconfig.js')
const eslint = require('./tasks/eslint.js')
const eslintrcJson = require('./tasks/eslintrc.json.js')
const fixpack = require('./tasks/fixpack.js')
const flowtype = require('./tasks/flowtype.js')
const gitignore = require('./tasks/gitignore.js')
const gitInit = require('./tasks/git-init.js')
const jsconfigJson = require('./tasks/jsconfig.json.js')
const npmDevDeps = require('./tasks/npm-dev-deps.js')
const npmEngines = require('./tasks/npm-engines.js')
const npmInit = require('./tasks/npm-init.js')
const npmName = require('./tasks/npm-name.js')
const npmPublishConfig = require('./tasks/npm-publish-config.js')
const npmTest = require('./tasks/npm-test.js')
const travisYml = require('./tasks/travis.yml.js')

function loadTasks () {
  return [
    gitInit, // should be 1st
    npmInit, // should be 2nd
    npmName, // should be 3rd
    badgeNpm,
    appveyorYml,
    travisYml,
    editorconfig, // no deps
    eslintrcJson,
    gitignore,
    jsconfigJson,
    npmEngines,
    badgeAppVeyor,
    badgeTravis,
    npmPublishConfig,
    eslint,
    flowtype,
    npmTest,
    fixpack, // should be near last
    npmDevDeps // should be last
  ]
}

module.exports = {
  loadTasks
}