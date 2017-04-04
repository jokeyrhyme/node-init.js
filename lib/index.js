/* eslint-disable no-console */

/* @flow */
'use strict'

const path = require('path')

const logUpdate = require('log-update')

const fs = require('./fs.js')
const git = require('./git.js')
const { getScope } = require('./pkg.js')
const { loadTasks } = require('./tasks.js')
const {
  TASK_CHECKING, TASK_DONE, TASK_SKIPPED, TASK_WORKING,
  TASK_STATUSES
} = require('./values.js')

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

function runTask (
  { fn, isNeeded = () => Promise.resolve(true), label } /* : Task */,
  options /* : TaskOptions */
) /* : Promise<any> */ {
  logUpdate(`${label}: ${TASK_STATUSES[TASK_CHECKING]}`)
  return isNeeded(options)
    .then((needed) => {
      if (!needed) {
        logUpdate(`${label}: ${TASK_STATUSES[TASK_SKIPPED]}`)
        return
      }
      logUpdate(`${label}: ${TASK_STATUSES[TASK_WORKING]}`)
      return fn(options)
        .then(() => logUpdate(`${label}: ${TASK_STATUSES[TASK_DONE]}`))
    })
    .catch((err) => console.error(label, err))
    .then(() => logUpdate.done())
}

function runTasks (tasks /* : Task[] */, options /* : TaskOptions */) {
  return tasks.reduce((prev, task) => {
    return prev.then(() => runTask(task, options))
  }, Promise.resolve())
}

function init ([ dir ] /* : string[] */, flags /* : Flags */) {
  ensureProjectDir(dir)
    .then(() => git.isGitClean(projectDir))
    .then((isGitClean) => {
      if (!isGitClean && flags.checkGitStatus) {
        console.error('ERROR: detected un-versioned changes')
        console.log('specify --no-check-git-status to run anyway')
        return
      }
      return Promise.all([
        getScope(projectDir, flags.scope),
        loadTasks()
      ])
      .then(([ scope, tasks ]) => runTasks(tasks, {
        cwd: projectDir,
        scope
      }))
    })
}

module.exports = {
  init
}
