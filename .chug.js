var path = require('path');
var chug = require('chug');
var figlet = require('figlet');
var pkg = require('./package');
var dir = __dirname;

figlet.text('Jymin v' + pkg.version, {font: 'Standard'}, function (e, art) {

  var pattern = /^.*\/(workspace|node_modules|lighterio)\/([\d\w-_]+)\//i;
  var url = 'https://github.com/lighterio/$2/blob/master/';
  var urls = [];
  var content;

  // Concatenate and output all non-plugin scripts.
  var load = chug('scripts')
    .each(function (asset) {
      urls.push(asset.location.replace(pattern, url));
    })
    .concat('jymin.js')
    .each(function (asset) {
      content = "var version = '" + pkg.version + "';\n\n" + asset.getContent();
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
        content);
    })
    .wrap('window, document, location, Math')
    .minify()
    .each(function (asset) {
      asset.content = addEval(asset.content);
      asset.minifiedContent = addEval(asset.minifiedContent);
    })
    .write(dir, 'jymin.js')
    .write(dir, 'jymin.min.js', 'minified');
});

function addEval(code) {
  return code.replace(
    /([$_a-z]+) ?= ?JSON\.parse\(([$_a-z]+)\)/i,
    'eval("eval.J="+$2);$1=eval.J');
}
