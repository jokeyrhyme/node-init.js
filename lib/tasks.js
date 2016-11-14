/* @flow */
'use strict'

const intersection = require('lodash.intersection')

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

/**
e.g. sequence for resource identifier A:
1. all tasks with "provides: [ A ]" a.k.a. writes
2. all tasks with "requires: [ A ]" a.k.a. reads
3. all tasks with "settles: [ A ]" a.k.a. finalises
*/

function compareByMetadata (
  { provides: proA = [], requires: reqA = [], settles: setA = [] } /* : Task */,
  { provides: proB = [], requires: reqB = [], settles: setB = [] } /* : Task */
) /* : number */ {
  if (
    intersection(proA, reqB).length ||
    intersection(proA, setB).length ||
    intersection(reqA, setB).length
  ) {
    return -1
  }
  if (
    intersection(proB, reqA).length ||
    intersection(proB, setA).length ||
    intersection(reqB, setA).length
  ) {
    return 1
  }
  return 0
}

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
  compareByMetadata,
  loadTasks
}
