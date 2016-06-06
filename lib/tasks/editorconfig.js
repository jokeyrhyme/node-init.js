'use strict'

const path = require('path')

const ini = require('ini')

const fs = require('../fs.js')

const LABEL = '.editorconfig initialised'

function fn ({ cwd }) {
  const filePath = path.join(cwd, '.editorconfig')
  return fs.touch(filePath)
    .then(() => fs.readFile(filePath, 'utf8'))
    .then(ini.parse)
    .then((cfg) => {
      cfg.root = true
      cfg['*'] = cfg['*'] || {}
      cfg['*'].charset = 'utf-8'
      cfg['*'].end_of_line = 'lf'
      cfg['*'].indent_size = 2
      cfg['*'].indent_style = 'space'
      cfg['*'].insert_final_newline = true
      cfg['*'].trim_trailing_whitespace = true
      return ini.stringify(cfg, { whitespace: true })
    })
    .then((data) => fs.writeFile(filePath, data))
}

module.exports = {
  fn,
  label: LABEL
}
