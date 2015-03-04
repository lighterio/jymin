var chug = require('chug');
var figlet = require('figlet');
var pkg = require('./package');
var dir = __dirname;

figlet.text('Jymin v' + pkg.version, {font: 'Standard'}, function (e, art) {

  var pattern = /^.*\/(workspace|node_modules|lighterio)\/([\d\w-_]+)\//i;
  var url = 'https://github.com/lighterio/$2/blob/master/';
  var urls = [];

  // Concatenate and output all non-plugin scripts.
  chug('scripts')
    .each(function (asset) {
      urls.push(asset.location.replace(pattern, url));
    })
    .concat()
    .each(function (asset) {
      asset.setContent(
        "/**" + art.replace(/ +$/, '').replace(/ *\n/g, '\n * ') + "\n" +
        " *\n" +
        " * http://lighter.io/jymin\n" +
        " *\n" +
        " * If you're seeing this in production, you really should minify.\n" +
        " *\n" +
        " * Source files:\n" +
        " *   " + urls.join("\n *   ") + "\n" +
        " */\n\n\n" +
        "var Jymin = {version: '" + pkg.version + "'};\n\n" +
        "//+env:commonjs\n" +
        "// Support CommonJS.\n" +
        "if (typeof exports == 'object') {\n" +
        "  module.exports = Jymin;\n" +
        "}\n" +
        "//-env:commonjs\n\n" +
        "//+env:amd\n" +
        "// Support AMD.\n" +
        "else if (typeof define == 'function' && define.amd) {\n" +
        "  define(function() {\n" +
        "    return Jymin;\n" +
        "  });\n" +
        "}\n" +
        "//-env:amd\n\n" +
        "//+env:window\n" +
        "// Support browsers.\n" +
        "else {\n" +
        "  this.Jymin = Jymin;\n" +
        "}\n" +
        "//-env:window\n\n" +
        asset.getContent());
    })
    .cull('browser', 'ok')
    .write(dir, 'jymin.js')
    .replace(/Jymin\.([$_a-zA-Z0-9]+)(\s*=)?/g, function (match, name, equals) {
      return equals ? 'var ' + name + ' =' : name;
    })
    .cull('env', 'min')
    .wrap()
    .minify()
    .write(dir, 'jymin.min.js', 'minified');
});

function addEval(code) {
  return code.replace(
    /([$_a-z]+) ?= ?JSON\.parse\(([$_a-z]+)\)/i,
    'eval("eval.J="+$2);$1=eval.J');
}
