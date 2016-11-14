/* @flow */
'use strict'

const test = require('ava')

const { compareByMetadata } = require('../lib/tasks.js')

const noop = () => Promise.resolve()

test('tasks without metadata', (t) => {
  const tasks = [
    { fn: noop, id: 'a', label: 'a' },
    { fn: noop, id: 'b', label: 'b' },
    { fn: noop, id: 'c', label: 'c' }
  ]
  t.notThrows(() => tasks.sort(compareByMetadata))
})

test('2x "provides: FOO" and 1x "requires: FOO"', (t) => {
  const tasks = [
    { fn: noop, id: 'a', label: 'a', provides: [ 'FOO' ] },
    { fn: noop, id: 'b', label: 'b', requires: [ 'FOO' ] },
    { fn: noop, id: 'c', label: 'c', provides: [ 'FOO' ] }
  ]
  t.notThrows(() => tasks.sort(compareByMetadata))
  const ids = tasks.map((task) => task.id)
  t.deepEqual(ids, [ 'a', 'c', 'b' ])
})

test('1x "provides: FOO" and 2x "requires: FOO"', (t) => {
  const tasks = [
    { fn: noop, id: 'a', label: 'a', requires: [ 'FOO' ] },
    { fn: noop, id: 'b', label: 'b', requires: [ 'FOO' ] },
    { fn: noop, id: 'c', label: 'c', provides: [ 'FOO' ] }
  ]
  t.notThrows(() => tasks.sort(compareByMetadata))
  const ids = tasks.map((task) => task.id)
  t.deepEqual(ids, [ 'c', 'a', 'b' ])
})

test('2x "provides: FOO" and 1x "settles: FOO"', (t) => {
  const tasks = [
    { fn: noop, id: 'a', label: 'a', provides: [ 'FOO' ] },
    { fn: noop, id: 'b', label: 'b', settles: [ 'FOO' ] },
    { fn: noop, id: 'c', label: 'c', provides: [ 'FOO' ] }
  ]
  t.notThrows(() => tasks.sort(compareByMetadata))
  const ids = tasks.map((task) => task.id)
  t.deepEqual(ids, [ 'a', 'c', 'b' ])
})

test('"provides: FOO" and "requires: FOO" and "settles: FOO"', (t) => {
  const tasks = [
    { fn: noop, id: 'a', label: 'a', settles: [ 'FOO' ] },
    { fn: noop, id: 'b', label: 'b', requires: [ 'FOO' ] },
    { fn: noop, id: 'c', label: 'c', provides: [ 'FOO' ] }
  ]
  t.notThrows(() => tasks.sort(compareByMetadata))
  const ids = tasks.map((task) => task.id)
  t.deepEqual(ids, [ 'c', 'b', 'a' ])
})

test('A, A->B, B->C, BC->end', (t) => {
  const tasks = [
    { fn: noop, id: 'a', label: 'a', requires: [ 'B', 'C' ] },
    { fn: noop, id: 'b', label: 'b', provides: [ 'C' ], requires: [ 'B' ] },
    { fn: noop, id: 'c', label: 'c', provides: [ 'B' ], requires: [ 'A' ] },
    { fn: noop, id: 'd', label: 'd', provides: [ 'A' ] }
  ]
  t.notThrows(() => tasks.sort(compareByMetadata))
  const ids = tasks.map((task) => task.id)
  t.deepEqual(ids, [ 'd', 'c', 'b', 'a' ])
})
