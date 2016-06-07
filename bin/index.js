#!/usr/bin/env node
'use strict'

const meow = require('meow')
const updateNotifier = require('update-notifier')

const pkg = require('../package.json')
const init = require('../lib/index.js').init

updateNotifier({ pkg }).notify()

const cli = meow(`
Usage:
    $ node-init [project]

Examples
    $ node-init
    $ node-init my-project
`, {})

init(cli.input, cli.flags)
