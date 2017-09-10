/* @flow */
'use strict';

const { access, readFile, unlink } = require('fs');
const path = require('path');
// $FlowFixMe: util.promisify is tricky to define :(
const { promisify } = require('util');

const execa = require('execa');
const updateJsonFile = require('update-json-file');

const {
  addScript,
  getPkg,
  isReactProject,
  removeScript,
} = require('../pkg.js');
const {
  JSON_OPTIONS,
  PACKAGE_JSON,
  PACKAGE_JSON_DEVDEPS,
} = require('../values.js');

const LABEL = 'ESLint installed and configured';

const ESLINT_PACKAGES = [
  'eslint',
  'eslint-plugin-import',
  'eslint-plugin-node',
  'eslint-plugin-promise',
];

const ESLINT_REACT_PACKAGES = ['eslint-plugin-react'];

async function eslintIgnore(cwd) {
  const ESLINTIGNORE_PATH = path.join(cwd, '.eslintignore');

  // migrate from old .eslintignore file
  let lines;
  try {
    await promisify(access)(ESLINTIGNORE_PATH);

    const text = await promisify(readFile)(ESLINTIGNORE_PATH, 'utf8');
    lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => !!line);

    await promisify(unlink)(ESLINTIGNORE_PATH);
  } catch (err) {
    lines = [];
  }

  // populate settings in package.json
  await updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      pkg.eslintIgnore = Array.from(
        new Set([...lines, ...(pkg.eslintIgnore || [])])
      );

      return pkg;
    },
    JSON_OPTIONS
  );
}

function npmInstall(cwd) {
  return getPkg(cwd).then(pkg => {
    let packages = [].concat(ESLINT_PACKAGES);
    if (isReactProject(pkg)) {
      packages = packages.concat(ESLINT_REACT_PACKAGES);
    }
    const devDeps = Object.keys(pkg.devDependencies || {});
    if (!packages.every(name => devDeps.includes(name))) {
      return execa('npm', ['install', '--save-dev', ...packages], { cwd });
    }
  });
}

function npmScript(cwd) {
  return updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      addScript(pkg, 'eslint', 'eslint --fix --cache .');

      // call ESLint from "pretest", because `--fix` may change files
      addScript(pkg, 'pretest', 'npm run eslint');

      // do not call ESLint from "posttest" or "test"
      removeScript(pkg, 'posttest', 'npm run eslint');
      removeScript(pkg, 'test', 'npm run eslint');

      return pkg;
    },
    JSON_OPTIONS
  );
}

function npmUninstall(cwd) {
  const standardStylePackages = [
    'eslint-config-semistandard',
    'eslint-config-standard',
    'eslint-config-standard-jsx',
    'eslint-config-standard-react',
    'eslint-plugin-standard',
  ];

  return execa('npm', ['uninstall', '--save-dev', ...standardStylePackages], {
    cwd,
  });
}

/* :: import type { TaskOptions } from '../types.js' */

async function fn({ cwd } /* : TaskOptions */) {
  await npmUninstall(cwd);
  await npmInstall(cwd);
  await npmScript(cwd);
  await eslintIgnore(cwd);
}

module.exports = {
  fn,
  id: path.basename(__filename),
  label: LABEL,
  provides: [PACKAGE_JSON_DEVDEPS],
  requires: [PACKAGE_JSON],
};
