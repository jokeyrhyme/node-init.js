'use strict'

const test = require('ava')

const { ensureArrayHead, ensureArrayTail } = require('../lib/data.js')

const ensureArrayHeadData = [
  { args: [ ['a', 'b'], 'c' ], expected: [ 'c', 'a', 'b' ] },
  { args: [ ['a', 'b'], 'b' ], expected: [ 'b', 'a' ] }
]

ensureArrayHeadData.forEach((d) => test(
  `ensureArrayHead(${JSON.stringify(d.args)})`,
  (t) => t.deepEqual(ensureArrayHead(...d.args), d.expected))
)

const ensureArrayTailData = [
  { args: [ ['a', 'b'], 'c' ], expected: [ 'a', 'b', 'c' ] },
  { args: [ ['a', 'b'], 'a' ], expected: [ 'b', 'a' ] }
]

ensureArrayTailData.forEach((d) => test(
  `ensureArrayTail(${JSON.stringify(d.args)})`,
  (t) => t.deepEqual(ensureArrayTail(...d.args), d.expected))
)
