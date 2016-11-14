/* @flow */
'use strict'

const path = require('path')

const test = require('ava')

const fs = require('../lib/fs.js')
const { loadTasks } = require('../lib/tasks.js')

const TASKS_DIR = path.join(__dirname, '..', 'lib', 'tasks')

test('all tasks uniquely loaded', (t) => {
  return fs.readdir(TASKS_DIR)
    .then((files) => {
      t.true(Array.isArray(files))

      const tasks = loadTasks()
      t.is(files.length, tasks.length)

      const labels = tasks.map((task) => task.label)
      const uniqueLabels = Array.from(new Set(labels))
      t.is(files.length, uniqueLabels.length)
    })
})
