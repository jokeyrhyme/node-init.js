# jokeyrhyme / node-init

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
```


## What does this do?

- runs `git init` to start a git repository, if none is found

- ensures there's a .gitignore file containing "node_modules"

- runs `npm init -y` to start a package.json or to restore important missing fields to an existing package.json

- ensures "engines" is set in package.json, defaults to major versions of current `npm` and `node`

- installs and configures [ESLint](http://eslint.org/), with [JavaScript Standard Style](https://github.com/feross/eslint-config-standard)

- adds an `npm run eslint` script for ESLint
