/* @flow */
'use strict'

const path = require('path')

const test = require('ava')

const { getScope, injectScope } = require('../lib/pkg.js')

function shortCwd (cwd) {
  return `.../${path.basename(cwd || '')}`
}

function fixturePath (name) {
  return path.join(__dirname, 'fixtures', name)
}

const getScopeData = [
  { cwd: '', scope: '', expected: '' },
  { cwd: '', scope: 'org', expected: 'org' },
  { cwd: '', scope: '@org', expected: 'org' },
  { cwd: fixturePath('named'), scope: 'org', expected: 'org' },
  { cwd: fixturePath('named'), scope: '', expected: '' },
  { cwd: fixturePath('scoped'), scope: '', expected: 'myscope' },
  { cwd: fixturePath('scoped'), scope: 'org', expected: 'org' }
]

getScopeData.forEach((d) => test(
  `getScope("${shortCwd(d.cwd)}", "${d.scope}")`,
  (t) => getScope(d.cwd, d.scope)
    .then((scope) => t.is(scope, d.expected))
))

const injectScopeData = [
  { args: ['', ''], expected: '' },
  { args: ['', 'name'], expected: 'name' },
  { args: ['new', 'name'], expected: '@new/name' },
  { args: ['', '@org/name'], expected: '@org/name' },
  { args: ['new', '@org/name'], expected: '@new/name' }
]

injectScopeData.forEach((d) => test(
  `injectScope(${JSON.stringify(d.args)})`,
  (t) => t.is(injectScope(...d.args), d.expected)
))
