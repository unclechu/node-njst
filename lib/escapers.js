/**
 * @overview Escapers for special symbols.
 */

var regs = require('./regs');

module.exports = {};

/**
 * Escape special symbols for generating native JS code.
 *
 * @param {string} str Source
 * @returns {string} Escaped source
 */
module.exports.compileEscape = function (str) {
	regs.compile.escapeChars.forEach(function (val) {
		str = str.replace(val.reg, val.val);
	});
	return str;
}

/**
 * Unescape special symbols for generating native JS code.
 *
 * @param {string} str Escaped
 * @returns {string} Unescaped source
 */
module.exports.compileUnescape = function (str) {
	regs.compile.unescapeChars.forEach(function (val) {
		str = str.replace(val.reg, val.val);
	});
	return str;
}

/**
 * Escape special symbols for a simple constructions.
 *
 * @param {string} str Source
 * @returns {string} Escaped source
 */
module.exports.simpleEscape = function (str) {
	regs.simple.escapeChars.forEach(function (val) {
		str = str.replace(val.reg, val.val);
	});
	return str;
}