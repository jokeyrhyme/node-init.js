#!/usr/bin/env node
/* @flow */
'use strict'

const meow = require('meow')
const updateNotifier = require('update-notifier')

const pkg = require('../package.json')
const init = require('../lib/index.js').init

updateNotifier({ pkg }).notify()

const cli = meow(`
Usage:
    $ node-init [project]

Options:
    --scope [scope]  set npm @scope prefix

Examples
    $ node-init
    $ node-init my-project
    $ node-init my-project --scope my-org
`, {
  string: [ 'scope' ]
})

init(cli.input, cli.flags)
