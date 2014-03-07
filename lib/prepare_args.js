/*!
 * Prepare arguments to render or parse helper
 *
 * License: GPLv3
 * Author: Viacheslav Lotsmanov
 */

var exceptions = require('./exceptions');

/**
 * Prepare arguments to render or parse
 *
 * Public
 */
module.exports =
function prepareArgs(arguments) {
    var result = {
        context: arguments[1],
        inputParams: null,
        callback: null
    };

    /** find optional arguments */
    var optArgs = Array.prototype.slice.call(arguments, 2);
    var limitOptArgs = 0;
    if (optArgs.length > 0) {
        if (typeof optArgs[0] === 'function') {
            limitOptArgs = 1;
            result.callback = optArgs[0];
        } else {
            limitOptArgs = 2;
            result.inputParams = optArgs[0];
            if (optArgs.length > 1) result.callback = optArgs[1];
        }

        if (optArgs.length > limitOptArgs) {
            var overLimitOptArgs = optArgs.slice(limitOptArgs);
            result.callback && process.nextTick(function () {
                result.callback(new exceptions.UnknownRenderAgrument(
                    'Unknown render arguments: ' + overLimitOptArgs.toString()
                ));
            });
            return false;
        }
    }

    /** arguments validation */
    if (typeof result.context !== 'object' && result.context !== null) {
        result.callback && process.nextTick(function () {
            result.callback(new exceptions.IncorrectTemplateContextType());
        });
        return false;
    }
    if(typeof result.inputParams !== 'object'
    && typeof result.inputParams !== 'undefined'
    && result.inputParams !== null) {
        result.callback && process.nextTick(function () {
            result.callback(new exceptions.IncorrectInputParams());
        });
        return false;
    }
    if (typeof result.callback !== 'function' && result.callback !== null) {
        result.callback && process.nextTick(function () {
            result.callback(new exceptions.IncorrectCallbackArgument());
        });
        return false;
    }

    return result;
};
