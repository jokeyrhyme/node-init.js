# jokeyrhyme / node-init [![npm](https://img.shields.io/npm/v/@jokeyrhyme/node-init.svg?maxAge=2592000)](https://www.npmjs.com/package/@jokeyrhyme/node-init) [![Travis CI Status](https://travis-ci.org/jokeyrhyme/node-init.svg?branch=master)](https://travis-ci.org/jokeyrhyme/node-init) [![AppVeyor Status](https://ci.appveyor.com/api/projects/status/github/jokeyrhyme/node-init?branch=master&svg=true)](https://ci.appveyor.com/project/jokeyrhyme/node-init)

impose my will upon a new or existing Node.js project


## Usage

```sh
npm install -g @jokeyrhyme/node-init

# use to start a fresh new project from scratch:
node-init my-project

# which is the equivalent of running:
mkdir my-project; cd my-project; node-init

# without a project name, assume current working directory:
node-init

# to find more details about usage
node-init --help
```


## What does this do?

- runs `git init` to start a git repository, if none is found

- ensures there's a .gitignore file containing "node_modules"

- runs `npm init -y` to start a package.json or to restore important missing fields to an existing package.json

- ensures "engines" is set in package.json, defaults to major versions of current `npm` and `node`

- installs and configures [ESLint](http://eslint.org/), with [JavaScript Standard Style](https://github.com/feross/eslint-config-standard)

- adds an `npm run eslint` script for ESLint

- ensures all versions in "devDependencies" in package.json start with "^"

- adds an `npm run fixpack` script for [fixpack](https://www.npmjs.com/package/fixpack)

- ensures [.editorconfig](http://editorconfig.org/) exists

- ensures "name" in package.json includes desired scope (if any)

- sets default `{ publishConfig: { access: 'public' } }` in package.json if there is a scope

- adds an NPM version badge to README.md if none is found

- adds a [Travis CI](https://travis-ci.org/) badge to README.md if none is found (GitHub-only)

- ensures .travis.yml has good defaults at least (GitHub-only)

- adds an [AppVeyor](http://www.appveyor.com/) badge to README.md if none is found (GitHub-only or Bitbucket-only)

- ensures appveyor.yml has good defaults at least (GitHub-only or Bitbucket-only)
