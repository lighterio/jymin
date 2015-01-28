var fs = require('fs');
var resolve = require('path').resolve;

global.window = global.window || {};
global.Jymin = global.Jymin || {};

var dirs = ['scripts', 'plugins'];
dirs.forEach(function (dir) {
  var files = fs.readdirSync(dir);

  describe('Syntax and loading', function () {

    files.forEach(function (name) {

      it('works in ' + dir + '/' + name, function () {
        require('../' + dir + '/'  + name);
      });

    });

  });
});

/*
require('../scripts/ajax');
require('../scripts/arrays');
require('../scripts/cookies');
require('../scripts/cookies');
require('../scripts/dates');
require('../scripts/dom');
require('../scripts/emitter');
require('../scripts/events');
require('../scripts/forms');
require('../scripts/history');
require('../scripts/json');
require('../scripts/logging');
require('../scripts/numbers');
require('../scripts/objects');
require('../scripts/storage');
require('../scripts/strings');
require('../scripts/types');
require('../scripts/url');
*/