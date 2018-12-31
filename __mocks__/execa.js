/* @flow */
'use strict';

let result /* : Object */ = {};

module.exports = async () /* : Promise<Object> */ => {
  return result;
};

module.exports.__setResult = (r /* : Object */) => {
  result = r;
};
