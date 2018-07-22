'use strict';

const { readdir } = require('fs');
const path = require('path');
const { promisify } = require('util');

const { loadTasks } = require('../lib/tasks.js');

const TASKS_DIR = path.join(__dirname, '..', 'lib', 'tasks');

let tasks, taskIds;
beforeAll(async () => {
  tasks = await loadTasks();
  taskIds = tasks.map(task => task.id);
});

test('loadTasks()', async () => {
  const files = await promisify(readdir)(TASKS_DIR);
  expect(Array.isArray(files)).toBe(true);
  expect(files.length).toBe(tasks.length);
});

test('all tasks have unique "id" and "label"', () => {
  const labels = tasks.map(task => task.label);
  const uniqueLabels = Array.from(new Set(labels));
  expect(tasks.length).toBe(uniqueLabels.length);

  const ids = tasks.map(task => task.id);
  const uniqueIds = Array.from(new Set(ids));
  expect(tasks.length).toBe(uniqueIds.length);
});

test('all tasks "fn" function', () => {
  tasks.forEach(task => {
    expect(typeof task.fn).toBe('function');
  });
});

function assertTaskBefore(before /* : string */, after /* : string[] */) {
  const ids = [before, ...after];

  const theseTasks = tasks.filter(task => ids.includes(task.id));
  const indices = theseTasks.map(task => tasks.indexOf(task));
  expect(Math.min(...indices)).toBe(taskIds.indexOf(before));
}

test('npm-name.js before tasks that use package.json:name', () => {
  assertTaskBefore('npm-name.js', ['badge-npm.js']);
});

test('git-init.js before tasks that use `git` or .git/', () => {
  assertTaskBefore('git-init.js', [
    'appveyor.yml.js',
    'badge-appveyor.js',
    'badge-travis.js',
    'npm-init.js',
    'travis.yml',
  ]);
});

test('npm-init.js before tasks that use package.json', () => {
  assertTaskBefore('npm-init.js', [
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
    'npm-install.js',
    'npm-name.js',
    'npm-publish-config.js',
    'npm-scripts.js',
    'npm-uninstall.js',
    'npm-test.js',
    'travis.yml.js',
  ]);
});

function assertTaskAfter(before /* : string[] */, after /* : string */) {
  const ids = [...before, after];

  const theseTasks = tasks.filter(task => ids.includes(task.id));
  const indices = theseTasks.map(task => tasks.indexOf(task));
  expect(Math.max(...indices)).toBe(taskIds.indexOf(after));
}

test('npm-dev-deps.js after tasks that install devDeps', () => {
  assertTaskAfter(
    ['eslint.js', 'fixpack.js', 'flowtype.js'],
    'npm-dev-deps.js',
  );
});
