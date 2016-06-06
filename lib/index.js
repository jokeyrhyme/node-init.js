'use strict';

const path = require('path');

const figures = require('figures')

const fs = require('./fs.js')
const gitignore = require('./tasks/gitignore.js')
const gitInit = require('./tasks/git-init.js')
const npmInit = require('./tasks/npm-init.js')

let projectDir = process.cwd()
function ensureProjectDir (dir) {
    if (!dir) {
        return Promise.resolve()
    }
    projectDir = path.join(process.cwd(), dir)
    return fs.mkdir(projectDir)
        .then(() => console.log(`project dir: ${projectDir}`))
        .catch((err) => {
            if (err.code === 'EEXIST') {
                console.error('target directory exists, run from within');
            }
            throw err;
        })
}

function runTask ({ fn, label }, options) {
    return fn(options)
        .then(() => console.log(`${label}: ${figures.tick}`))
        .catch((err) => console.error(label, err))
}

function init ([ dir ], flags) {
    ensureProjectDir(dir)
        .then(() => runTask(gitInit, { cwd: projectDir }))
        .then(() => runTask(gitignore, { cwd: projectDir }))
        .then(() => runTask(npmInit, { cwd: projectDir }))
}

module.exports = {
    init
}
