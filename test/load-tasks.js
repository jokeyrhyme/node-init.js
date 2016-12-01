'use strict'

const path = require('path')

const test = require('ava')

const fs = require('../lib/fs.js')
const { loadTasks } = require('../lib/tasks.js')

const TASKS_DIR = path.join(__dirname, '..', 'lib', 'tasks')

let tasks, taskIds
test.before(async () => {
  tasks = await loadTasks()
  taskIds = tasks.map((task) => task.id)
})

test('loadTasks()', async (t) => {
  const files = await fs.readdir(TASKS_DIR)
  t.true(Array.isArray(files))
  t.is(files.length, tasks.length)
})

test('all tasks have unique "id" and "label"', (t) => {
  const labels = tasks.map((task) => task.label)
  const uniqueLabels = Array.from(new Set(labels))
  t.is(tasks.length, uniqueLabels.length)

  const ids = tasks.map((task) => task.id)
  const uniqueIds = Array.from(new Set(ids))
  t.is(tasks.length, uniqueIds.length)
})

test('all tasks "fn" function', (t) => {
  tasks.forEach((task) => {
    t.is(typeof task.fn, 'function', task.id)
  })
})

function assertTaskBefore (
  t /* : any */,
  before /* : string */,
  after /* : string[] */
) {
  const ids = [ before, ...after ]

  const theseTasks = tasks.filter((task) => ids.includes(task.id))
  const indices = theseTasks.map((task) => tasks.indexOf(task))
  t.is(Math.min(...indices), taskIds.indexOf(before))
}

test('npm-name.js before tasks that use package.json:name', (t) => {
  assertTaskBefore(t, 'npm-name.js', [
    'badge-npm.js'
  ])
})

test('git-init.js before tasks that use `git` or .git/', (t) => {
  assertTaskBefore(t, 'git-init.js', [
    'appveyor.yml.js',
    'badge-appveyor.js',
    'badge-travis.js',
    'npm-init.js',
    'travis.yml'
  ])
})

test('npm-init.js before tasks that use package.json', (t) => {
  assertTaskBefore(t, 'npm-init.js', [
    'appveyor.yml.js',
    'badge-appveyor.js',
    'badge-npm.js',
    'badge-travis.js',
    'eslint.js',
    'eslintrc.json.js',
    'fixpack.js',
    'flowtype.js',
    'npm-dev-deps.js',
    'npm-engines.js',
    'npm-name.js',
    'npm-publish-config.js',
    'npm-test.js',
    'travis.yml.js'
  ])
})

function assertTaskAfter (
  t /* : any */,
  before /* : string[] */,
  after /* : string */
) {
  const ids = [ ...before, after ]

  const theseTasks = tasks.filter((task) => ids.includes(task.id))
  const indices = theseTasks.map((task) => tasks.indexOf(task))
  t.is(Math.max(...indices), taskIds.indexOf(after))
}

test('npm-dev-deps.js after tasks that install devDeps', (t) => {
  assertTaskAfter(t, [
    'eslint.js',
    'fixpack.js',
    'flowtype.js'
  ], 'npm-dev-deps.js')
})

test('fixpack.js after tasks that use package.json (except npm-dev-deps.js)', (t) => {
  assertTaskAfter(t, [
    'appveyor.yml.js',
    'badge-appveyor.js',
    'badge-npm.js',
    'badge-travis.js',
    'eslint.js',
    'eslintrc.json.js',
    'flowtype.js',
    'npm-engines.js',
    'npm-init.js',
    'npm-name.js',
    'npm-publish-config.js',
    'npm-test.js',
    'travis.yml.js'
  ], 'fixpack.js')
})
