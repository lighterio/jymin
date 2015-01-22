var $ = require('../jymin.node');

describe('Strings', function () {

  describe('ensureString', function () {

    it('appends an argument to a string', function () {
      is($.ensureString('Hello'), 'Hello');
      is($.ensureString(0), '0');
      is($.ensureString({}), '[object Object]');
      is($.ensureString([]), '');
      is($.ensureString(), 'undefined');
    });

  });

  // TODO: Test everything!

});