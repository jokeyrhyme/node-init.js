/* eslint-disable no-console */

/* @flow */
'use strict'

const path = require('path')

const figures = require('figures')

const fs = require('./fs.js')
const { getScope } = require('./pkg.js')
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

let projectDir = process.cwd()
function ensureProjectDir (dir /* : string */) {
  if (!dir) {
    return Promise.resolve()
  }
  projectDir = path.join(process.cwd(), dir)
  return fs.mkdir(projectDir)
    .then(() => console.log(`project dir: ${projectDir}`))
    .catch((err) => {
      if (err.code === 'EEXIST') {
        console.error('target directory exists, run from within')
      }
      throw err
    })
}

/* :: import type { Flags, Task, TaskOptions } from './types.js' */

function runTask ({ fn, label }/* : Task */, options /* : TaskOptions */) {
  return fn(options)
    .then(() => console.log(`${label}: ${figures.tick}`))
    .catch((err) => console.error(label, err))
}

function runTasks (tasks /* : Array<Task> */, options /* : TaskOptions */) {
  return tasks.reduce((prev, task) => {
    return prev.then(() => runTask(task, options))
  }, Promise.resolve())
}

function init ([ dir ] /* : Array<string> */, flags /* : Flags */) {
  ensureProjectDir(dir)
    .then(() => getScope(projectDir, flags.scope))
    .then((scope) => runTasks([
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
    ], { cwd: projectDir, scope }))
}

module.exports = {
  init
}
