/* @flow */
'use strict';

const path = require('path');

const intersection = require('lodash.intersection');

const fs = require('./fs.js');

/* :: import type { Flags, Task, TaskOptions } from './types.js' */

const TASKS_DIR = path.join(__dirname, 'tasks');

/**
e.g. sequence for resource identifier A:
1. all tasks with "provides: [ A ]" a.k.a. writes
2. all tasks with "requires: [ A ]" a.k.a. reads
3. all tasks with "settles: [ A ]" a.k.a. finalises
*/

function compareByMetadata(
  { provides: proA = [], requires: reqA = [], settles: setA = [] } /* : Task */,
  { provides: proB = [], requires: reqB = [], settles: setB = [] } /* : Task */
) /* : number */ {
  if (
    intersection(proA, reqB).length ||
    intersection(proA, setB).length ||
    intersection(reqA, setB).length
  ) {
    return -1;
  }
  if (
    intersection(proB, reqA).length ||
    intersection(proB, setA).length ||
    intersection(reqB, setA).length
  ) {
    return 1;
  }
  const setDiff = setA.length - setB.length;
  if (Math.abs(setDiff)) {
    return setDiff;
  }
  const reqDiff = reqA.length - reqB.length;
  if (Math.abs(reqDiff)) {
    return reqDiff;
  }
  return 0;
}

function loadTasks() /* : Promise<Task[]> */ {
  return fs
    .readdir(TASKS_DIR)
    .then(files =>
      files.map(file => {
        // $FlowFixMe: intentionally `require()` a dynamic path here
        return require(path.join(TASKS_DIR, file));
      })
    )
    .then(tasks => tasks.sort(compareByMetadata)); // .sort() mutates!
}

module.exports = {
  compareByMetadata,
  loadTasks
};
