#!/usr/bin/env node
/* @flow */
'use strict';

const meow = require('meow');
const { enginesNotify } = require('package-engines-notifier');
const { updateNodejsNotifier } = require('update-nodejs-notifier');
const updateNotifier = require('update-notifier');

const pkg = require('../package.json');

updateNotifier({ pkg }).notify();

updateNodejsNotifier();

const cli = meow(
  `
Usage:
    $ node-init [project]

Options:
    --scope [scope]        set npm @scope prefix
    --check-git-status     stop work if un-versioned changes
    --no-check-git-status  do work even if un-versioned changes

Examples
    $ node-init
    $ node-init my-project
    $ node-init my-project --scope my-org
`,
  {
    default: {
      checkGitStatus: true,
    },
    string: ['scope'],
  }
);

if (!enginesNotify({ pkg: pkg })) {
  // no engine trouble, proceed :)
  const { init } = require('../lib/index.js');

  init(cli.input, cli.flags);
} else {
  process.exitCode = 1;
}
