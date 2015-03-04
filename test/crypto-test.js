describe('Jymin.md5', function () {

  var crypto = require('crypto');
  var json = JSON.stringify(JSON.stringify(this.fn.toString()));
  var md5 = function (text) {
    return crypto.createHash('md5').update(text).digest('hex');
  };

  it('hashes strings', function () {
    is(Jymin.md5('hello'), md5('hello'));
    is(Jymin.md5('WTF!?'), md5('WTF!?'));
    is(Jymin.md5(json), md5(json));
  });

  bench('Benchmark', function () {

    var a, b;

    it('Jymin', function () {
      a = Jymin.md5(json);
    });

    it('Node', function () {
      b = crypto.createHash('md5').update(json).digest('hex');
    });

    is(a, b);

  });

});
