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
 * @param {string} str Source
 * @returns {string} Escaped source
 */
function compileEscape(str) {
    regs.compile.escapeChars.forEach(function (val) {
        str = str.replace(val.reg, val.val);
    });
    return str;
}

/**
 * Unescape special symbols for generating native JS code
 *
 * @param {string} str Escaped
 * @returns {string} Unescaped source
 */
function compileUnescape(str) {
    regs.compile.unescapeChars.forEach(function (val) {
        str = str.replace(val.reg, val.val);
    });
    return str;
}

/**
 * Escape special symbols for a simple constructions
 *
 * @param {string} str Source
 * @returns {string} Escaped source
 */
function simpleEscape(str) {
    regs.simple.escapeChars.forEach(function (val) {
        str = str.replace(val.reg, val.val);
    });
    return str;
}

// public
module.exports = {
    compileEscape: compileEscape,
    compileUnescape: compileUnescape,
    simpleEscape: simpleEscape
};
