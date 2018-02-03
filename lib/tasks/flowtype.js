/* @flow */
'use strict';

const path = require('path');

const { hasAnnotatedFiles } = require('detect-flowtype');
const execa = require('execa');
const latestVersion = require('latest-version');
const updateJsonFile = require('update-json-file');

const { copyFile } = require('../fs.js');
const { addScript, getPkg, removeScript } = require('../pkg.js');
const {
  JSON_OPTIONS,
  PACKAGE_JSON,
  PACKAGE_JSON_DEVDEPS,
  PROJECT_CODE,
} = require('../values.js');

/* :: import type { TaskOptions } from '../types.js' */

const LABEL = 'FlowType installed and configured';

const SKELETON_FLOWCONFIG_PATH = path.join(
  __dirname,
  '..',
  'skeleton',
  '.flowconfig'
);

function npmUninstall(cwd /* : string */) {
  return getPkg(cwd).then(({ devDependencies }) => {
    const devDeps = Object.keys(devDependencies || {});
    if (devDeps.includes('flow-bin')) {
      return execa('npm', ['uninstall', '--save-dev', 'flow-bin'], {
        cwd,
      });
    }
  });
}

function npmScript(cwd /* : string */) {
  return latestVersion('flow-bin').then(flowVersion =>
    updateJsonFile(
      path.join(cwd, 'package.json'),
      pkg => {
        pkg.scripts = pkg.scripts || {};

        // drop our old script name, the new one will be shorter
        delete pkg.scripts.flow_check;
        for (const script of ['pretest', 'test', 'posttest']) {
          removeScript(pkg, script, 'npm run flow_check');
        }

        pkg.scripts.flow = `npx -q flow-bin@^${flowVersion} check`;
        addScript(pkg, 'test', 'npm run flow');

        return pkg;
      },
      JSON_OPTIONS
    )
  );
}

function fn({ cwd } /* : TaskOptions */) {
  return Promise.all([
    copyFile(SKELETON_FLOWCONFIG_PATH, path.join(cwd, '.flowconfig')),
    npmUninstall(cwd).then(() => npmScript(cwd)),
  ]);
}

function isNeeded({ cwd } /* : TaskOptions */) {
  return hasAnnotatedFiles({ dirPath: cwd });
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  provides: [PACKAGE_JSON_DEVDEPS],
  requires: [PACKAGE_JSON, PROJECT_CODE],
};
