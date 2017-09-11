'use strict';

jest.unmock('fs');

jest.mock('../lib/index.js');

test('bin/index.js entrypoint calls lib/index.js:init()', () => {
  require('../bin/index.js');
  expect(require('../lib/index.js').init.mock.calls).toEqual([
    [
      // arguments
      [], // arguments[0]: [dir]
      {
        // arguments[1]: flags
        checkGitStatus: true,
      },
    ],
  ]);
});
