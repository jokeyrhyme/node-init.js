'use strict';

let version = global.process.version;

module.exports = Object.create(global.process, {
  version: {
    get: function() {
      return version;
    },
    set: function(value) {
      version = value;
    },
  },
});
