/* eslint-disable no-console */

/* @flow */
'use strict';

const { mkdir } = require('fs');
const path = require('path');
// $FlowFixMe: util.promisify is tricky to define :(
const { promisify } = require('util');

const logUpdate = require('log-update');

const git = require('./git.js');
const { getScope } = require('./pkg.js');
const { loadTasks } = require('./tasks.js');
const {
  TASK_CHECKING,
  TASK_DONE,
  TASK_SKIPPED,
  TASK_WORKING,
  TASK_STATUSES,
} = require('./values.js');

let projectDir = process.cwd();
async function ensureProjectDir(dir /* : string */) /* : Promise<void> */ {
  if (!dir) {
    return;
  }
  projectDir = path.join(process.cwd(), dir);
  try {
    await promisify(mkdir)(projectDir);
    console.log(`project dir: ${projectDir}`);
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.error('target directory exists, run from within');
    }
    throw err;
  }
}

/* :: import type { Flags, Task, TaskOptions } from './types.js' */

async function runTask(
  { fn, isNeeded, label } /* : Task */,
  options /* : TaskOptions */,
) /* : Promise<any> */ {
  logUpdate(`${label}: ${TASK_STATUSES[TASK_CHECKING]}`);
  try {
    const needed = isNeeded ? await isNeeded(options) : true;
    if (!needed) {
      logUpdate(`${label}: ${TASK_STATUSES[TASK_SKIPPED]}`);
      return;
    }
    logUpdate(`${label}: ${TASK_STATUSES[TASK_WORKING]}`);
    await fn(options);
    logUpdate(`${label}: ${TASK_STATUSES[TASK_DONE]}`);
  } catch (err) {
    console.error(label, err);
  } finally {
    logUpdate.done();
  }
}

async function init([dir] /* : string[] */, flags /* : Flags */) {
  await ensureProjectDir(dir);
  const isGitClean = await git.isGitClean(projectDir);
  if (!isGitClean && flags.checkGitStatus) {
    console.error('ERROR: detected un-versioned changes');
    console.log('specify --no-check-git-status to run anyway');
    return;
  }
  const [scope, tasks] = await Promise.all([
    getScope(projectDir, flags.scope),
    loadTasks(),
  ]);
  for (const task of tasks) {
    await runTask(task, {
      cwd: projectDir,
      scope,
    });
  }
}

module.exports = {
  init,
};
