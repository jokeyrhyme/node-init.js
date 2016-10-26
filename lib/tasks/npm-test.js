/* @flow */
'use strict'

const path = require('path')

const { updateJson } = require('../json.js')

const LABEL = '`npm test` executes installed test runners'

/* :: import type { TaskOptions } from '../index.js' */

function fn ({ cwd, scope } /* : TaskOptions */) {
  return updateJson(
    path.join(cwd, 'package.json'),
    (pkg) => {
      if (pkg.devDependencies.ava) {
        pkg.scripts = Object.assign({}, pkg.scripts, {
          ava: 'ava'
        })
        if (pkg.devDependencies.nyc) {
          pkg.scripts = Object.assign({}, pkg.scripts, {
            ava: 'nyc ava',
            nyc: 'nyc check-coverage'
          })
        }
      }

      if (pkg.devDependencies.jest) {
        pkg.scripts = Object.assign({}, pkg.scripts, {
          jest: 'jest'
        })
        pkg.jest = Object.assign({}, pkg.jest, {
          collectCoverage: true,
          coverageThreshold: {
            global: {
              lines: 90
            }
          },
          testRegex: '/__tests__/[^\\/]*\\.js$'
        })
      }

      if (pkg.devDependencies.mocha) {
        pkg.scripts = Object.assign({}, pkg.scripts, {
          mocha: 'mocha'
        })
      }

      return pkg
    }
  )
}

module.exports = {
  fn,
  label: LABEL
}
