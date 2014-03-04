/*!
 * Escaping special symbols
 *
 * License: GPLv3
 * Author: Viacheslav Lotsmanov
 */

var regs = require('./regs');

/**
 * Escape special symbols for generating native JS code
 *
 * Arguments:
 *   str [String] source
 *
 * Returns:
 *   [String] escaped source
 */
module.exports.compileEscape
= function compileEscape(str) {
    regs.compile.escapeChars.forEach(function (val) {
        str = str.replace(val.reg, val.val);
    });
    return str;
};

/**
 * Unescape special symbols for generating native JS code
 *
 * Arguments:
 *   str [String] escaped source
 *
 * Returns:
 *   [String] unescaped source
 */
module.exports.compileUnescape
= function compileUnescape(str) {
    regs.compile.unescapeChars.forEach(function (val) {
        str = str.replace(val.reg, val.val);
    });
    return str;
};

/**
 * Escape special symbols for a simple constructions
 *
 * Arguments:
 *   str [String] source
 *
 * Returns:
 *   [String] escaped source
 */
module.exports.simpleEscape
= function simpleEscape(str) {
    regs.simple.escapeChars.forEach(function (val) {
        str = str.replace(val.reg, val.val);
    });
    return str;
};
