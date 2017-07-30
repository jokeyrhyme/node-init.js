# jokeyrhyme / node-init [![npm](https://img.shields.io/npm/v/@jokeyrhyme/node-init.svg?maxAge=2592000)](https://www.npmjs.com/package/@jokeyrhyme/node-init) [![AppVeyor Status](https://img.shields.io/appveyor/ci/jokeyrhyme/node-init-js/master.svg)](https://ci.appveyor.com/project/jokeyrhyme/node-init-js) [![Travis CI Status](https://travis-ci.org/jokeyrhyme/node-init.js.svg?branch=master)](https://travis-ci.org/jokeyrhyme/node-init.js)

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


### Options

```
--scope [scope]        set npm @scope prefix
--check-git-status     stop work if un-versioned changes
--no-check-git-status  do work even if un-versioned changes
```


## What does this do?


### Version Control

-   runs `git init` to start a git repository, if none is found

-   ensures there's a .gitignore file containing "node_modules"


### NPM good-practices

-   runs `npm init -y` to start a package.json or to restore important missing fields to an existing package.json

-   ensures "name" in package.json includes desired scope (if any)

-   ensures "engines" is set in package.json, defaults to major versions of current `npm` and `node`

-   ensures all versions in "devDependencies" in package.json start with "^"

-   adds an NPM version badge to README.md if none is found, and the package is not marked as "private"

-   sets default `{ publishConfig: { access: 'public' } }` in package.json if there is a scope

-   use [`sort-package-json`](https://github.com/keithamus/sort-package-json) to keep package.json tidy

-   package "main" refers to a file that exists (created for you, if not)

-   use [`nsp`](https://github.com/nodesecurity/nsp) to check for vulnerable dependencies


### Code Quality

-   installs and configures [prettier](https://github.com/prettier/prettier) and `npm run prettier`

-   installs and configures [ESLint](http://eslint.org/), with [eslint-plugin-node](https://github.com/mysticatea/eslint-plugin-node)

-   install and configure [jest](https://github.com/facebook/jest) if other test frameworks are absent and `npm test` is not configured

-   adds an `npm run eslint` script for ESLint

-   installs and configures [FlowType](https://flowtype.org/) and `npm run flow`

-   uninstalls FlowType when not used

-   add `npm run ava` if using [ava](https://github.com/avajs/ava)

-   add `npm run jest` if using [jest](https://github.com/facebook/jest)

-   add `npm run mocha` if using [mocha](https://github.com/mochajs/mocha)

-   add `npm run nyc` if using [nyc](https://github.com/istanbuljs/nyc)


### Continuous Integration

-   adds a [Travis CI](https://travis-ci.org/) badge to README.md if none is found (GitHub-only)

-   ensures .travis.yml has good defaults at least (GitHub-only)

-   adds an [AppVeyor](http://www.appveyor.com/) badge to README.md if none is found (GitHub-only or Bitbucket-only)

-   ensures appveyor.yml has good defaults at least (GitHub-only or Bitbucket-only)


### IDE / Code Editor settings

-   copies [.editorconfig](http://editorconfig.org/) from [multi-lingual template config](https://github.com/jokeyrhyme/standard-editorconfig)

-   ensures jsconfig.json for [Visual Studio Code](https://code.visualstudio.com/) exists


### Other Opinionated Stuff

-   for simplicity, text files should use UNIX line-endings

-   install a project-local copy of [`npx`](https://github.com/zkat/npx), which is very useful for executing other CLI tools

