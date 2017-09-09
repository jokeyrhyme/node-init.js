'use strict';

const { compareByMetadata } = require('../lib/tasks.js');

const noop = () => Promise.resolve();

test('tasks without metadata', () => {
  const tasks = [
    { fn: noop, id: 'a', label: 'a' },
    { fn: noop, id: 'b', label: 'b' },
    { fn: noop, id: 'c', label: 'c' }
  ];
  expect(() => tasks.sort(compareByMetadata)).not.toThrow();
});

test('2x "provides: FOO" and 1x "requires: FOO"', () => {
  const tasks = [
    { fn: noop, id: 'a', label: 'a', provides: ['FOO'] },
    { fn: noop, id: 'b', label: 'b', requires: ['FOO'] },
    { fn: noop, id: 'c', label: 'c', provides: ['FOO'] }
  ];
  expect(() => tasks.sort(compareByMetadata)).not.toThrow();
  const ids = tasks.map(task => task.id);
  expect(ids).toEqual(['a', 'c', 'b']);
});

test('1x "provides: FOO" and 2x "requires: FOO"', () => {
  const tasks = [
    { fn: noop, id: 'a', label: 'a', requires: ['FOO'] },
    { fn: noop, id: 'b', label: 'b', requires: ['FOO'] },
    { fn: noop, id: 'c', label: 'c', provides: ['FOO'] }
  ];
  expect(() => tasks.sort(compareByMetadata)).not.toThrow();
  const ids = tasks.map(task => task.id);
  expect(ids).toEqual(['c', 'a', 'b']);
});

test('2x "provides: FOO" and 1x "settles: FOO"', () => {
  const tasks = [
    { fn: noop, id: 'a', label: 'a', provides: ['FOO'] },
    { fn: noop, id: 'b', label: 'b', settles: ['FOO'] },
    { fn: noop, id: 'c', label: 'c', provides: ['FOO'] }
  ];
  expect(() => tasks.sort(compareByMetadata)).not.toThrow();
  const ids = tasks.map(task => task.id);
  expect(ids).toEqual(['a', 'c', 'b']);
});

test('"provides: FOO" and "requires: FOO" and "settles: FOO"', () => {
  const tasks = [
    { fn: noop, id: 'a', label: 'a', settles: ['FOO'] },
    { fn: noop, id: 'b', label: 'b', requires: ['FOO'] },
    { fn: noop, id: 'c', label: 'c', provides: ['FOO'] }
  ];
  expect(() => tasks.sort(compareByMetadata)).not.toThrow();
  const ids = tasks.map(task => task.id);
  expect(ids).toEqual(['c', 'b', 'a']);
});

test('A, A->B, B->C, BC->end', () => {
  const tasks = [
    { fn: noop, id: 'a', label: 'a', requires: ['B', 'C'] },
    { fn: noop, id: 'b', label: 'b', provides: ['C'], requires: ['B'] },
    { fn: noop, id: 'c', label: 'c', provides: ['B'], requires: ['A'] },
    { fn: noop, id: 'd', label: 'd', provides: ['A'] }
  ];
  expect(() => tasks.sort(compareByMetadata)).not.toThrow();
  const ids = tasks.map(task => task.id);
  expect(ids).toEqual(['d', 'c', 'b', 'a']);
});
