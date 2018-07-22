/* @flow */
'use strict';

const chalk = require('chalk');
const figures = require('figures');

const GIT_REPO = 'GIT_REPO';
const PACKAGE_JSON = 'PACKAGE_JSON';
const PACKAGE_JSON_DEVDEPS = 'PACKAGE_JSON_DEVDEPS';
const PACKAGE_JSON_NAME = 'PACKAGE_JSON_NAME';
const PROJECT_CODE = 'PROJECT_CODE';

const JSON_OPTIONS = {
  defaultValue: () => ({}),
  indent:       2,
};

const TASK_CHECKING = 'TASK_CHECKING';
const TASK_DONE = 'TASK_DONE';
const TASK_SKIPPED = 'TASK_SKIPPED';
const TASK_WORKING = 'TASK_WORKING';

const TASK_STATUSES = {
  [TASK_CHECKING]: chalk.blue(`CHECKING ${figures.ellipsis}`),
  [TASK_DONE]:     chalk.green(`DONE ${figures.tick}`),
  [TASK_SKIPPED]:  chalk.gray(`SKIPPED ${figures.cross}`),
  [TASK_WORKING]:  chalk.yellow(`WORKING ${figures.play}`),
};

module.exports = {
  GIT_REPO,
  PACKAGE_JSON,
  PACKAGE_JSON_DEVDEPS,
  PACKAGE_JSON_NAME,
  PROJECT_CODE,

  JSON_OPTIONS,

  TASK_CHECKING,
  TASK_DONE,
  TASK_SKIPPED,
  TASK_WORKING,

  TASK_STATUSES,
};
