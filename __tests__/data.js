'use strict';

const { ensureArrayTail } = require('../lib/data.js');

const ensureArrayTailData = [
  { args: [['a', 'b'], 'c'], expected: ['a', 'b', 'c'] },
  { args: [['a', 'b'], 'a'], expected: ['b', 'a'] },
];

ensureArrayTailData.forEach(d =>
  test(`ensureArrayTail(${JSON.stringify(d.args)})`, () =>
    expect(ensureArrayTail(...d.args)).toEqual(d.expected))
);
