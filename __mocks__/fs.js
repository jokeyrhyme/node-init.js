/* eslint-env jest */
/* @flow */
'use strict';

module.exports = jest.genMockFromModule('fs');

module.exports.access = (path /* : string */, cb /* : Function */) => {
  cb(null);
};

module.exports.readFile = (
  path /* : string */,
  options /* : string */,
  cb /* : Function */
) => {
  cb(null, '');
};

module.exports.unlink = (path /* : string */, cb /* : Function */) => {
  cb(null);
};
