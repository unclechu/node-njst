/*!
 * Debug module
 *
 * License: GPLv3
 * Author: Viacheslav Lotsmanov
 */

var path = require('path');

var exceptions = require('./exceptions');
var Params = require('./params');

var debugTplFileName = 'debug';

/**
 * Debug module constructor
 *
 * Arguments:
 *   inputParams (optional) [Object] key-value object of input parameters
 *
 * this:
 *   Debug example
 *
 * Public
 */
function Debug(inputParams) {
    if (typeof inputParams === 'undefined') inputParams = null;
    this.params = new Params(inputParams);

    this.params.set({
        debug: false,
        templateFilesDir: path.join(path.dirname(module.filename), '..', 'templates')
    });

    var njst = require('./njst');

    /** private */
    this._template = new njst(this.params.get(), true);
}

/**
 * Render debug template method
 *
 * Arguments:
 *   err [Error] exception
 *   callback (optional) [Function] callback function
 *
 * Public
 */
Debug.prototype.getDebugInfo
= function getDebugInfo(err/*, callback*/) {
    var callback = null;

    if (typeof arguments[1] === 'function') {
        callback = arguments[1];
    } else if( typeof arguments[1] !== 'undefined'
           &&  typeof arguments[1] !== 'function'
           &&  arguments[1] !== null ) {
        throw new IncorrectCallbackArgument();
    }

    if (err === null) err = new exceptions.NoExceptionToDebug();
    if (!(err instanceof Error)) err = new exceptions.IncorrectExceptionArgument();

    var exception = new exceptions.DebuggedError();

    var context = {
        params: this._template.getParams(),
        error: err,
        setMimeType: function setMimeType(str) {
            exception.mimeType = str;
        }
    };

    this._template.renderFile(debugTplFileName, context, function (renderErr, out) {
        if (renderErr) {
            callback && process.nextTick(function () {
                callback(
                    exception,
                    'Render debug template file error.'
                    + ((renderErr.message) ? '\n'+renderErr.message : '')
                );
            });
            return;
        }

        callback && process.nextTick(function () {
            callback(exception, out);
        });
    });
};

/** This module is a constructor */
module.exports = Debug;
