# Change Log


## Unreleased


### Added

-   Travis CI and AppVeyor (try to) update `npm` itself (#20)

-   Travis CI and AppVeyor `npm install --global` [yarn](https://github.com/yarnpkg/yarn), [flow-typed](https://github.com/flowtype/flow-typed), and [typings](https://github.com/typings/typings) (#48)

-   Travis CI tests with recommended Node.js versions (#50)


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
