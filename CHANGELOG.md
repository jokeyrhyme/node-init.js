# Change Log


## Unreleased


### Fixed

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
