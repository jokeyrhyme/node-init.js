'use strict'

const path = require('path')

const execa = require('execa')

const LABEL = 'npm package.json initialised'

function fn ({ cwd }) {
    return execa('npm', ['init', '-y'], { cwd })
}

module.exports = {
    fn,
    label: LABEL
}
