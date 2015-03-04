var fs = require('fs');
var resolve = require('path').resolve;
var spawn = require('child_process').spawn;
var cwd = process.cwd();

global.window = global.window || {};
global.document = global.document || {};
global.Jymin = global.Jymin || {};

var dirs = ['scripts', 'plugins'];
dirs.forEach(function (dir) {
  var files = fs.readdirSync(dir);
  files.forEach(function (name) {
    require('../' + dir + '/'  + name);
  });
});

after(function (done) {
  var child = spawn('npm', ['run', 'build'], {cwd: cwd});
  child.on('exit', done);
});