/* @flow */
'use strict'

const path = require('path')

const readPkgUp = require('read-pkg-up')

const fs = require('../fs.js')
const { PACKAGE_JSON } = require('../values.js')

const LABEL = 'package "main" points to a file that exists'

const SKELETON_INDEX_PATH = path.join(__dirname, '..', 'skeleton', 'index.js')

/* :: import type { TaskOptions } from '../types.js' */

function fn ({ cwd } /* : TaskOptions */) {
  return readPkgUp({ cwd })
    .then(({ pkg, path: pkgPath }) => {
      if (!pkg.main || typeof pkg.main !== 'string') {
        return
      }

      const mainPath = path.join(path.dirname(pkgPath), pkg.main)
      return fs.access(mainPath)
        .catch(() => fs.copyFile(SKELETON_INDEX_PATH, mainPath))
    })
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  requires: [ PACKAGE_JSON ]
}
