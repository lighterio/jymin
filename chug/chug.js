var cwd = process.cwd();

exports.version = require('../package.json').version;

require('figlet').text('Jymin v' + exports.version, {font: 'Standard'}, function (err, figlet) {

	figlet = figlet.replace(/\n/g, '\n *');

	require('chug')('core')
		.concat('jymin.js')
		.each(function (asset) {
			asset.setContent(
				"/**\n" +
				" *" + figlet + "\n" +
				" *\n" +
				" * http://lighter.io/jymin\n" +
				" * MIT License\n" +
				" *\n" +
				" * If you're seeing this, you haven't minified yet!\n" +
				" */\n\n\n" +
				"this.jymin = {version: '" + exports.version + "'};\n\n" +
				asset.getContent());
		})
		.wrap('window, document, location, Math')
		.minify()
		.each(function (asset) {
			asset.content = addEval(asset.content);
			asset.minifiedContent = addEval(asset.minifiedContent);
		})
		.write(cwd, 'jymin.js')
		.write(cwd, 'jymin.min.js', 'minified');

});

function addEval(code) {
	return code.replace(
		/([$_a-z]+) ?= ?JSON\.parse\(([$_a-z]+)\)/i,
		'eval("eval.J="+$2);$1=eval.J');
}

