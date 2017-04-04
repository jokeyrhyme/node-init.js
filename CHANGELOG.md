# Change Log


## Unreleased


### Added

-   display individual task status during operation

-   groundwork for skipping unnecessary tasks


## 1.10.0 - 2017-03-29


### Added

-   new safety check for un-versioned changes (via `git status`)

-   new `--no-check-git-status` flag to ignore safety check

-   ensure package "main" points to file (created for you, if not)


### Changed

-   `npm run fixpack` is now part of the "pretest" hook rather than "posttest"

-   update [execa](https://www.npmjs.com/package/execa) to 0.6.3 (from 0.6.0)


### Fixed

-   support .eslintrc.json file in `test/`, `tests/`, or `__tests__/` instead of always assuming `test/`


## 1.9.1 - 2017-03-06


### Changed

-   update [js-yaml](https://www.npmjs.com/package/js-yaml) to [3.8.2](https://github.com/nodeca/js-yaml/blob/master/CHANGELOG.md) (from [3.7.0](https://github.com/nodeca/js-yaml/blob/master/CHANGELOG.md))

-   update [update-notifier](https://www.npmjs.com/package/update-notifier) to 2.1.0 (from [1.0.3](https://github.com/yeoman/update-notifier/releases/tag/v1.0.3))


### Fixed

-   drop old [greenkeeper-postpublish](https://github.com/greenkeeperio/greenkeeper-postpublish) integration

-   drop explicit extends in test/.eslintrc.json


## 1.9.0 - 2017-02-02


### Added

-   GitLab CI integration for non-BitBucket non-GitHub projects (#75)


### Fixed

-   prevent `npm init -y` from populating "dependencies" (#96)

-   fix regression for fresh .eslintrc.json and jsconfig.json files


## 1.8.1 - 2017-02-02


### Changed

-   AppVeyor/Travis no longer configured to install type files

    -   [version these in your project instead](https://github.com/flowtype/flow-typed#why-do-i-need-to-commit-the-libdefs-that-flow-typed-installs-for-my-project)

-   AppVeyor installs and uses the latest NPM (#81)

-   update [execa](https://www.npmjs.com/package/execa) to 0.6.0 (from 0.5.0)

-   update [update-nodejs-notifier](https://www.npmjs.com/package/update-nodejs-notifier) to [1.1.1](https://github.com/jokeyrhyme/update-nodejs-notifier.js/releases/tag/1.1.1) (from [1.1.0](https://github.com/jokeyrhyme/update-nodejs-notifier.js/releases/tag/1.1.0))

-   depend upon [update-json-file](https://www.npmjs.com/package/update-json-file) [1.1.1](https://github.com/jokeyrhyme/update-json-file.js/releases/tag/1.1.1)


### Fixed

-   maintain consistent 2-space indents when editing JSON files


## 1.8.0 - 2016-12-20


### Changed

-   load tasks in sequence based on metadata, instead of hardcoded order

-   use [locate-path](https://github.com/sindresorhus/locate-path) package (#68)


### Fixed

-   remove 'node_modules' from Travis CI cache to avoid odd issues

-   `node-init` no longer unexpectedly breaks ESLint plugin configuration

-   fresh projects no longer cause `TypeError`s to throw (#61)


## 1.7.0 - 2016-11-03


### Added

-   Travis CI and AppVeyor (try to) update `npm` itself (#20)

-   Travis CI and AppVeyor `npm install --global` [yarn](https://github.com/yarnpkg/yarn), [flow-typed](https://github.com/flowtype/flow-typed), and [typings](https://github.com/typings/typings) (#48)

-   Travis CI and AppVeyor test with recommended Node.js versions (#50)


### Fixed

-   use AppVeyor badge from [shields.io](https://shields.io) (more reliable) (#34)


## 1.6.0 - 2016-10-26


### Added

-   add `npm run ava` if using [ava](https://github.com/avajs/ava)

-   add `npm run jest` if using [jest](https://github.com/facebook/jest)

-   add `npm run mocha` if using [mocha](https://github.com/mochajs/mocha)

-   add `npm run nyc` if using [nyc](https://github.com/istanbuljs/nyc)

-   stop execution if user's Node.js version doesn't match our package.json "engines"

-   tell users (via [package-engines-notifier](https://github.com/jokeyrhyme/package-engines-notifier.js)) if their Node.js doesn't match our package.json "engines"

-   tell users (via [update-nodejs-notifier](https://github.com/jokeyrhyme/update-nodejs-notifier.js)) if the major version of their Node.js is older than the current stable


### Fixed

-   no `npm cache clean` instructions for AppVeyor

-   install 64-bit Node.js in AppVeyor

-   improve detection AppVeyor badge in README.md to avoid duplicates

-   flowtype: no more `|| exit 0` in npm script (#42, #43)


## 1.5.0 - 2016-10-19


### Added

-   add [eslint-plugin-node](https://github.com/mysticatea/eslint-plugin-node)


### Changed

-   copy useful bits from [`yarn`'s FlowType settings](https://github.com/yarnpkg/yarn/blob/v0.16.0/.flowconfig)


### Fixed

-   add `npm cache clean` to AppVeyor configuration

-   no longer cache node_modules in AppVeyor (problematic?)


## 1.4.0 - 2016-08-23


### Added

-   add ESLint settings / devDeps for React (if found)


### Changed

-   default FlowType configuration ignores ava cache files

-   bump devDeps


## 1.3.0 - 2016-08-06


### Added

-   add and internally use [FlowType](https://flowtype.org/) (#11)


### Changed

-   use [standards-based EditorConfig settings](https://github.com/jokeyrhyme/standard-editorconfig)

-   bump deps and devDeps


## 1.2.0 - 2016-06-08


### Added

-   add basic jsconfig.json defaults for Visual Studio Code (#9)


### Changed

-   use .eslintrc if found, but prefer .eslintrc.json otherwise (#12)


### Fixed

-   "eslint:recommended" should be first in .eslintrc.json (#16)

-   don't add "standard" to .eslintrc.json if "semistandard" is already there (#17)


## 1.1.0 - 2016-06-07


### Added

-   [update-notifier](https://www.npmjs.com/package/update-notifier)

-   npm package scope capabilities (#1, #2)

-   if npm scope, set publishConfig defaults (#3)

-   add NPM version badge to README.md (#8)

-   add Travis CI integration and badge (#4)

-   add AppVeyor integration and badge (#5)


### Changed

-   npm-engines: use faster `process.version`, not `node --version`

-   skip `npm install --save-dev` steps if already in devDependencies
