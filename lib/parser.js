/*!
 * Parser module
 *
 * License: GPLv3
 * Author: Viacheslav Lotsmanov
 */

var vm = require('vm');
var fs = require('fs');

var regs = require('./regs');
var params = require('./params');
var escapers = require('./escapers');
var exceptions = require('./exceptions');

/**
 * Parser function
 *
 * Arguments:
 *   source [String] template code
 *   context [Object] key-value object of template context
 *   inputParams (optional) [Object] key-value object of input parameters
 *     (to extend constructor example parameters)
 *   callback (optional) [Function] callback function
 *     Arguments:
 *       err [Object, null] instance of Error or null if no errors
 *       rendered [String] rendered template string
 *
 * this:
 *   Constructor example
 *
 * Public
 */
module.exports
= function parser(source, context/*, inputParams, callback*/) {
    var callback = null;
    var inputParams = null;

    /** arguments validation */
    if (typeof source !== 'string' && ! (source instanceof Buffer)) {
        throw new exceptions.IncorrectTemplateCodeType();
    } else {
        source = source.toString();
    }
    if (typeof context !== 'object' && context !== null) {
        throw new exceptions.IncorrectTemplateContextType();
    } else {
        context = (typeof context === 'object') ? context : {};
    }

    /** find optional arguments */
    Array.prototype.slice.call(arguments, 2).forEach(function (val) {
        if ( ! callback && typeof val === 'function') callback = val;
        else if ( ! inputParams && typeof val === 'object') inputParams = val;
    });

    /** merging constructor example parameters and input parameters */
    inputParams = params.extend.call(this, inputParams);

    var systemContext = new function systemContext() {
        this.initInstruments = function initInstruments(code/*, options*/) {
            var options = {
                print: true,
                isolation: true,
            };
            if (typeof arguments[1] === 'object') {
                for (var key in arguments[1]) {
                    if (key in options) {
                        options[key] = arguments[1][key];
                    } else {
                        new exceptions.UnknownInitInstrumentsOption();
                    }
                }
            }

            var header='', footer='';

            header += ';toPrint="";';
            if (options.print) {
                header += ';function print(value) { return toPrint += value; };';
                footer += ';toPrint;';
            } else {
                header += ';function print() {};';
                header += ';print();';
            }

            if (options.isolation) {
                if (options.print) {
                    header = ';(function () {' + header;
                    footer += ';return toPrint;})();';
                } else {
                    header = ';(function () {' + header + ';return ';
                    footer += ';})();';
                }
            }

            return header + code + footer;
        };
        this.print = function () {};
        this.toPrint = '';
    };

    /** merging input and system contexts */
    for (var key in context) {
        if (typeof systemContext[key] !== 'undefined') {
            callback && process.nextTick(function () {
                callback(new exceptions.SystemContextOverwritten());
            });
            return;
        }
        systemContext[key] = context[key];
    }
    context = systemContext;

    /** parsing */
    source = '%>'+ source +'<%';
    source = compileParse(source);
    try {
        source = context.initInstruments(source);
        source = vm.runInNewContext(source, context);
    } catch (err) {
        callback && process.nextTick(function () {
            callback(new exceptions.ParseTemplateSyntaxError());
        });
        return;
    }
    callback && process.nextTick(function () {
        callback(null, source);
    });
};

/**
 * Helper for "compile" constructions <% ... %>
 *
 * Private
 */
function compileParse(str) {
    var inclusions;
    if (inclusions = str.match(regs.compile.all)) {
        inclusions.forEach(function (val) {
            var code = val.replace(regs.compile.only, '$1');
            code = escapers.compileEscape(code);
            code = ";print('"+ code +"');";
            code = simpleParse(code);
            str = str.replace(regs.compile.first, function () {
                return code;
            });
        });
    }
    return str;
}

/**
 * Helper for "simple" constructions %{...}
 *
 * Private
 */
function simpleParse(str) {
    var inclusions;
    if (inclusions = str.match(regs.simple.all)) {
        inclusions.forEach(function (val) {
            var code = val.replace(regs.simple.only, '$1');
            code = escapers.compileUnescape(code);
            code = escapers.simpleEscape(code);
            code = "'+("+ code +")+'";
            str = str.replace(regs.simple.first, function () {
                return code;
            });
        });
    }
    return str;
}
