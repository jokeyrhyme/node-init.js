/* @flow */
'use strict';

let pkg /* : Object */ = {};

module.exports = async (
  pkgPath /* : string */,
  updater /* : (value: any) => Promise<any> */,
) /* : Promise<void> */ => {
  await updater(pkg);
};

module.exports.__setPackage = (p /* : Object */) => {
  pkg = p;
};
