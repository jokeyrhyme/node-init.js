/* @flow */
'use strict'

const os = require('os')
const path = require('path')

const through2 = require('through2')
const vfs = require('vinyl-fs')

const fs = require('../fs.js')
const {
  getBitbucketPath, getGitHubPath, getOriginUrl,
  isPublicGitHubOrBitbucket
} = require('../git.js')
const { GIT_REPO, PACKAGE_JSON } = require('../values.js')

const LABEL = 'AppVeyor badge in README.md'

/* :: import type { TaskOptions } from '../types.js' */

function fn ({ cwd } /* : TaskOptions */) {
  return Promise.all([
    getOriginUrl(cwd),
    fs.touch(path.join(cwd, 'README.md'))
  ])
    .then(([ remoteUrl ]) => new Promise((resolve, reject) => {
      let hosting
      let publicPath
      publicPath = getBitbucketPath(remoteUrl)
      if (publicPath) {
        hosting = 'bitbucket'
      } else {
        publicPath = getGitHubPath(remoteUrl)
        if (publicPath) {
          hosting = 'github'
        }
      }
      if (!hosting || !publicPath) {
        resolve()
        return // free AppVeyor requires public git hosting
      }
      publicPath = publicPath.replace(/\./g, '-')
      vfs.src('README.md', { cwd })
        .pipe(through2.obj((file, enc, cb) => {
          const svgUrl = `https://img.shields.io/appveyor/ci/${publicPath}/master.svg`
          const projectUrl = `https://ci.appveyor.com/project/${publicPath}`
          const mdBadge = `[![AppVeyor Status](${svgUrl})](${projectUrl})`
          let contents = file.contents.toString(enc)
          if (!contents.includes(`(${projectUrl})`)) {
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

function isNeeded ({ cwd } /* : TaskOptions */) {
  // free AppVeyor requires public GitHub / Bitbucket hosting
  return isPublicGitHubOrBitbucket(cwd)
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  requires: [ GIT_REPO, PACKAGE_JSON ]
}
