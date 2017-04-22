/* @flow */
'use strict';

const without = require('lodash.without');

function ensureArrayTail(
  array /* : Array<any> */,
  value /* : any */
) /* : Array<any> */ {
  return [...without(array, value), value];
}

module.exports = {
  ensureArrayTail
};
