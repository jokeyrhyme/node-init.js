'use strict';

const fs = require('fs');
const path = require('path');

let projectDir = process.cwd();
function ensureProjectDir (dir) {
    if (!dir) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        projectDir = path.join(process.cwd(), dir)
        fs.mkdir(projectDir, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function init ([ dir ], flags) {
    console.log(dir, flags)
    ensureProjectDir(dir)
        .then(() => console.log(`project dir: ${projectDir}`))
}

module.exports = {
    init
}
