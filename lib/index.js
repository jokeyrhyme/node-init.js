/* eslint-disable no-console */

/* @flow */
'use strict'

const path = require('path')

const figures = require('figures')

const fs = require('./fs.js')
const { getScope } = require('./pkg.js')
const { loadTasks } = require('./tasks.js')

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
    .then((scope) => runTasks(loadTasks(), { cwd: projectDir, scope }))
}

module.exports = {
  init
}
