// Load Jymin using eval so it can be tested in Node.
var fs = require('fs');
var code = '' + fs.readFileSync(__dirname + '/jymin.js');
code = code.replace(/\nvar (\w+) = /g, '\nvar $1 = jymin.$1 = ');
code = 'var jymin = eval.jymin = {};\n' + code;
eval(code);
module.exports = eval.jymin;