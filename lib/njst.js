/**
 * @overview General module of nJSt
 * @version 0.2.1
 * @author Viacheslav Lotsmanov (unclechu)
 */

var parser = require('./parser')
var params = require('./params');

/**
 * Constructor of module. Can use as example of module:
 *   module.exports.render('...');
 * and like this:
 *   var njst = new module.exports;
 *   njst.render('...');
 *
 * @constructor
 * @param {object} inputParams
 * @this Constructor
 * @method render
 * @method setDefaultParams
 * @method getDefaultParams
 * @method setParams
 * @method getParams
 */
function Constructor(inputParams) {
    params.set.call(this, inputParams);
}

/**
 * Sets default parameters for new future examples of constructor.
 *
 * @param {object} inputParams
 */
Constructor.setDefaultParams = function (inputParams) {
    params.set.call(this, inputParams, true);
};

/**
 * Returns default parameters for future new examples of constructor.
 *
 * @returns {object} Default parameters
 */
Constructor.getDefaultParams = function () {
    return params.get.call(this, true);
};

/**
 * Sets parameters for example of constructor.
 *
 * @param {object} inputParams
 */
Constructor.setParams = function (inputParams) {
    params.set.call(this, inputParams);
};
Constructor.prototype.setParams = Constructor.setParams;

/**
 * Returns parameters of constructor example.
 *
 * @returns {object} Parameters
 */
Constructor.getParams = function () {
    return params.get.call(this);
};
Constructor.prototype.getParams = Constructor.getParams;

/**
 * Render template method
 *
 * @param {string} content
 * @param {object} context
 * @param {object} inputParams
 */
Constructor.render = function (source, context, inputParams/*, callback*/) {
    var callback = null;
    Array.prototype.slice.call(arguments, 0).forEach(function (val) {
        if (typeof val === 'function') callback = val;
    });

    if (source instanceof Buffer) {
        source = source.toString();
    } else if (typeof source !== 'string') {
        callback && process.nextTick(function () {
            callback(new IncorrectSourceCode('Source code is not string!'));
        });
        return;
    }

    if (typeof context !== 'object' && context !== null) {
        callback && process.nextTick(function () {
            callback(new IncorrectContext('Context must be an object or null!'));
        });
        return;
    }

    var parseParams = params.get.call(this);
    parseParams = params.extend.call(this, inputParams);

    code_to_render = parser.call(this, source, context, parseParams).toString();

    callback && process.nextTick(function () {
        callback(null, code_to_render);
    });
};
Constructor.prototype.render = Constructor.render;

//exceptions

function NjstException(message) { this.message = message }
NjstException.prototype = new Error;
NjstException.prototype.toString = function () {
    return 'nJSt ' + Error.prototype.toString.call(this);
}

function IncorrectSourceCode(message) { this.message = message }
IncorrectSourceCode.prototype = new NjstException;

function IncorrectContext(message) { this.message = message }
IncorrectContext.prototype = new NjstException;

module.exports.exceptions = {
    IncorrectSourceCode: IncorrectSourceCode,
    IncorrectContext: IncorrectContext
};

//exceptions end

//can create new object by itself: new module.exports
module.exports = Constructor;