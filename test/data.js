'use strict'

const test = require('ava')

const { ensureArrayTail } = require('../lib/data.js')

const ensureArrayTailData = [
  { args: [ ['a', 'b'], 'c' ], expected: [ 'a', 'b', 'c' ] },
  { args: [ ['a', 'b'], 'a' ], expected: [ 'b', 'a' ] }
]

ensureArrayTailData.forEach((d) => test(
  `ensureArrayTail(${JSON.stringify(d.args)})`,
  (t) => t.deepEqual(ensureArrayTail(...d.args), d.expected))
)
