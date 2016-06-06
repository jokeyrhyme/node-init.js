/* eslint-disable no-console */

'use strict'

const path = require('path')

const figures = require('figures')

const fs = require('./fs.js')
const gitignore = require('./tasks/gitignore.js')
const gitInit = require('./tasks/git-init.js')
const npmInit = require('./tasks/npm-init.js')
const npmEngines = require('./tasks/npm-engines.js')
const eslint = require('./tasks/eslint.js')
const fixpack = require('./tasks/fixpack.js')
const npmDevDeps = require('./tasks/npm-dev-deps.js')

let projectDir = process.cwd()
function ensureProjectDir (dir) {
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

function runTask ({ fn, label }, options) {
  return fn(options)
    .then(() => console.log(`${label}: ${figures.tick}`))
    .catch((err) => console.error(label, err))
}

function runTasks (tasks, options) {
  return tasks.reduce((prev, task) => {
    return prev.then(() => runTask(task, options))
  }, Promise.resolve())
}

function init ([ dir ], flags) {
  ensureProjectDir(dir)
    .then(() => runTasks([
        gitInit,
        gitignore,
        npmInit,
        npmEngines,
        eslint,
        fixpack,
        npmDevDeps
    ], { cwd: projectDir }))
}

module.exports = {
  init
}
