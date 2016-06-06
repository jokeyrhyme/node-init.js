#!/usr/bin/env node
'use strict'

const meow = require('meow')

const init = require('../lib/index.js').init

const cli = meow(`
Usage:
    $ node-init [project]

Examples
    $ node-init
    $ node-init my-project
`, {})

init(cli.input, cli.flags)
