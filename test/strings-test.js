require('../jymin.node.js');

describe('Strings', function () {

  describe('Jymin.ensureString', function () {

    it('appends an argument to a string', function () {
      is(Jymin.ensureString('Hello'), 'Hello');
      is(Jymin.ensureString(0), '0');
      is(Jymin.ensureString({}), '[object Object]');
      is(Jymin.ensureString([]), '');
      is(Jymin.ensureString(), 'undefined');
    });

  });

  // TODO: Test everything!

});