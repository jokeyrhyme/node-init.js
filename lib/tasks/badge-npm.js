/* @flow */
'use strict'

const os = require('os')
const path = require('path')

const through2 = require('through2')
const vfs = require('vinyl-fs')

const fs = require('../fs.js')
const { getPkg } = require('../pkg.js')

const LABEL = 'NPM version badge in README.md'

/* :: import type { TaskOptions } from '../types.js' */

function fn ({ cwd } /* : TaskOptions */) {
  return Promise.all([
    getPkg(cwd).then(({ name }) => name),
    fs.touch(path.join(cwd, 'README.md'))
  ])
    .then(([ pkgName ]) => new Promise((resolve, reject) => {
      vfs.src('README.md', { cwd })
        .pipe(through2.obj((file, enc, cb) => {
          const svgUrl = `https://img.shields.io/npm/v/${pkgName}.svg`
          const mdBadge = `[![npm](${svgUrl}?maxAge=2592000)](https://www.npmjs.com/package/${pkgName})`
          let contents = file.contents.toString(enc)
          if (!contents.includes(svgUrl)) {
            const lines = contents.split(os.EOL)
            lines[0] += ` ${mdBadge}`
            contents = lines.join(os.EOL)
          }
          file.contents = Buffer.from(contents, enc)
          cb(null, file)
        }))
        .pipe(vfs.dest(cwd))
        .on('error', (err) => reject(err))
        .on('end', () => resolve())
    }))
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL
}
