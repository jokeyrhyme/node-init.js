/* @flow */
'use strict'

const test = require('ava')

const { lib: { testEslintrcUpdater } } = require('../lib/tasks/eslintrc.json.js')

test('fresh test/.eslintrc.json', (t) => {
  const result = testEslintrcUpdater({}, { hasReact: false })
  t.is(result.extends, undefined)
})

test('old test/.eslintrc.json', (t) => {
  const result = testEslintrcUpdater(
    { extends: [ '../.eslintrc.json' ] },
    { hasReact: false }
  )
  t.is(result.extends, undefined)
})
