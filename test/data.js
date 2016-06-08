'use strict'

const test = require('ava')

const { ensureArrayHead } = require('../lib/data.js')

const ensureArrayHeadData = [
  { args: [ ['a', 'b'], 'c' ], expected: [ 'c', 'a', 'b' ] },
  { args: [ ['a', 'b'], 'b' ], expected: [ 'b', 'a' ] }
]

ensureArrayHeadData.forEach((d) => test(
  `ensureArrayHead(${JSON.stringify(d.args)})`,
  (t) => t.deepEqual(ensureArrayHead(...d.args), d.expected))
)
