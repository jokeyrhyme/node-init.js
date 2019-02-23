#!/usr/bin/env node
/* eslint-disable node/shebang */
/* tslint:disable no-console */

import meow from 'meow';
import { enginesNotify } from 'package-engines-notifier';
import { updateNodejsNotifier } from 'update-nodejs-notifier';
import updateNotifier from 'update-notifier';

import pkg from '../package.json';

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
    flags: {
      checkGitStatus: {
        default: true,
        type: 'boolean',
      },
      scope: {
        type: 'string',
      },
    },
  },
);

(async () => {
  if (!enginesNotify({ pkg })) {
    // no engine trouble, proceed :)
    const { init } = await import('../lib/index.js');

    init(cli.input, cli.flags);
  } else {
    process.exitCode = 1;
  }
})().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
