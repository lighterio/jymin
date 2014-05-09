var cwd = process.cwd();

exports.version = require('../package.json').version;

require('figlet').text('Jymin v' + exports.version, {font: 'Standard'}, function (err, figlet) {

	figlet = figlet.replace(/\n/g, '\n *');

	require('chug')('core')
		.concat('jymin.js')
		.wrap('window, document, location, Math')
		.each(function (asset) {
			asset.content =
				'/**\n' +
				' *' + figlet + '\n' +
				' *\n' +
				' * http://lighter.io/jymin\n' +
				' * MIT License\n' +
				' *\n' +
				' * If you\'re seeing this, you haven\'t minified yet!\n' +
				' */\n\n\n' +
				asset.content.replace(/JYMIN_VERSION/, exports.version);
		})
		.minify()
		.write(cwd, 'jymin.js')
		.write(cwd, 'jymin.min.js', 'minified');

});