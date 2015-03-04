// TODO: Find a good DOM mock library for testing.
global.window = global;
var document = window.document = {};
var location = window.location = document.location = {};
require(__dirname + '/jymin');
module.exports = Jymin;
