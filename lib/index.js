'use strict';

const path = require('path');

const fs = require('./fs.js')
const gitInit = require('./tasks/git-init.js')

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

function init ([ dir ], flags) {
    console.log(dir, flags)
    ensureProjectDir(dir)
        .then(() => gitInit.fn({ cwd: projectDir }))
}

module.exports = {
    init
}
