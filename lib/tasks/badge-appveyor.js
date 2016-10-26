/* @flow */
'use strict'

const os = require('os')
const path = require('path')

const through2 = require('through2')
const vfs = require('vinyl-fs')

const fs = require('../fs.js')
const { getBitbucketPath, getGitHubPath, getOriginUrl } = require('../git.js')
const { getPkg } = require('../pkg.js')

const LABEL = 'AppVeyor badge in README.md'

/* :: import type { TaskOptions } from '../index.js' */

function fn ({ cwd } /* : TaskOptions */) {
  return Promise.all([
    getOriginUrl(cwd),
    getPkg(cwd).then(({ name }) => name),
    fs.touch(path.join(cwd, 'README.md'))
  ])
    .then(([ remoteUrl, pkgName ]) => new Promise((resolve, reject) => {
      if (!remoteUrl) {
        resolve()
        return // don't bother if we have no remotes
      }
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
          const svgUrl = `https://ci.appveyor.com/api/projects/status/${hosting}/${publicPath}?branch=master&svg=true`
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

module.exports = {
  fn,
  label: LABEL
}
