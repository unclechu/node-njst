/**
 * @overview Escapers for special symbols.
 */

var regs = require('./regs');

module.exports = {};

module.exports.htmlEscape = function (str) {
	regs.compile.escapeChars.forEach(function (val) {
		str = str.replace(val.reg, val.val);
	});
	return str;
}

module.exports.htmlUnescape = function (str) {
	regs.compile.unescapeChars.forEach(function (val) {
		str = str.replace(val.reg, val.val);
	});
	return str;
}

module.exports.simpleEscape = function (str) {
	regs.simple.escapeChars.forEach(function (val) {
		str = str.replace(val.reg, val.val);
	});
	return str;
}