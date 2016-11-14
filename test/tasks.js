/* @flow */
'use strict'

const path = require('path')

const test = require('ava')

const fs = require('../lib/fs.js')
const { loadTasks } = require('../lib/tasks.js')

const TASKS_DIR = path.join(__dirname, '..', 'lib', 'tasks')

test('loadTasks()', (t) => {
  return fs.readdir(TASKS_DIR)
    .then((files) => {
      t.true(Array.isArray(files))

      const tasks = loadTasks()
      t.is(files.length, tasks.length)
    })
})

test('all tasks have unique "id" and "label"', (t) => {
  const tasks = loadTasks()

  const labels = tasks.map((task) => task.label)
  const uniqueLabels = Array.from(new Set(labels))
  t.is(tasks.length, uniqueLabels.length)

  const ids = tasks.map((task) => task.id)
  const uniqueIds = Array.from(new Set(ids))
  t.is(tasks.length, uniqueIds.length)
})

test('all tasks "fn" function', (t) => {
  const tasks = loadTasks()

  tasks.forEach((task) => {
    t.is(typeof task.fn, 'function', task.id)
  })
})
