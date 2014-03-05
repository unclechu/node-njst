/*!
 * nJSt
 * Native JavaScript Templates.
 * Main module.
 *
 * License: GPLv3
 * Author: Viacheslav Lotsmanov
 */

var path = require('path');
var fs = require('fs');

var exceptions = require('./exceptions');
var params = require('./params');
var parser = require('./parser');
var Debug = require('./debug');
var prepareArgs = require('./prepare_args');

/**
 * General constructor
 *
 * Arguments:
 *   inputParams [Object] key-value object of input parameters
 *   debugMode (optional) [Boolean] set true by debug module for rendering debug template
 *
 * Public methods of example of constructor:
 *   render
 *   renderFile
 *   setParams
 *   getParams
 *
 * Usage:
 *   var path = require('path');
 *   var njst = require('njst'); // "njst" is the "Constructor"
 *   var template = new njst({
 *     templateFilesDir: path.join(path.dirname(module.filename), 'templates')
 *   });
 *
 * this:
 *   Constructor example
 *
 * Public
 */
function Constructor(inputParams, debugMode) {
    if (typeof inputParams === 'undefined') inputParams = null;
    params.set.call(this, inputParams);

    this.debug = null;
    if (!debugMode) this.debug = new Debug(inputParams);
}

/**
 * Sets parameters for example of constructor
 *
 * Arguments:
 *   inputParams [Object] key-value object of input parameters
 *
 * Public
 */
Constructor.prototype.setParams
= function setParams(inputParams) {
    params.set.call(this, inputParams);
};

/**
 * Returns parameters of constructor example
 *
 * Returns:
 *   [Object] key-value object of constructor example parameters
 *
 * Public
 */
Constructor.prototype.getParams
= function getParams() {
    return params.get.call(this);
};

/**
 * Helper for prepare arguments of render methods
 *
 * Private
 */
function renderPrepare(arguments) {
    var result = prepareArgs(arguments);
    if (result === false) return result;

    /** merging constructor example parameters and input parameters */
    result.inputParams = params.extend.call(this, result.inputParams);

    return result;
};

/**
 * Helper for provide errors to callback or render debug template
 *
 * Arguments:
 *   err [Error] exception
 *   inputParams (optional) [Object] key-value object of input parameters
 *   callback (optional) [Function] callback function
 *
 * this:
 *   Constructor example
 */
function provideError(err/*, inputParams, callback*/) {
    var self = this;

    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('', null);
    args = prepareArgs(args);

    if (!(err instanceof Error)) err = new exceptions.IncorrectExceptionArgument();

    if (args.inputParams.debug && self.debug) {
        args.callback && process.nextTick(function () {
            self.debug.getDebugInfo(err, args.callback);
        });
    } else {
        args.callback && process.nextTick(function () {
            args.callback(err);
        });
    }
}

/**
 * Render template string
 *
 * Arguments:
 *   source [String] template string
 *   context [Object] key-value object of template context
 *   inputParams (optional) [Object] key-value object of custom parameters
 *     extends constructor example parameters just for this render
 *   callback (optional) [Function] callback function
 *     Arguments:
 *       err [Error, null] instance of Error constructor or null if no errors
 *       out [String] rendered code
 *
 * Public
 */
Constructor.prototype.render
= function render(source, context/*, inputParams, callback*/) {
    /** prepare arguments */
    var args = renderPrepare.call(this, arguments);
    if (args === false) return;

    /** arguments validation */
    if (source instanceof Buffer) {
        source = source.toString();
    } else if (typeof source !== 'string') {
        provideError.call(this, new exceptions.IncorrectTemplateCodeType(), args.inputParams, args.callback);
        return;
    }

    /** rendering */
    parser.call(this, source, args.context, args.inputParams, function (err, rendered) {
        if (err) {
            provideError.call(self, err, args.inputParams, args.callback);
            return;
        }

        args.callback && process.nextTick(function () {
            args.callback(null, rendered);
        });
    });
};

/**
 * Callback-recursive file search
 *
 * this:
 *   Constructor example
 *
 * Private
 */
function findFileExtension(filePath, extList, callback) {
    var self = this;

    if (!Array.isArray(extList)) {
        if (typeof extList !== null) {
            callback && callback(new exceptions.IncorrectTemplateFileExtensions());
            return;
        }
        extList = [];
    }
    extList = Array.prototype.slice.call(extList, 0); // clone the array

    extList.unshift(''); // at first try to use absolute path

    function checkExists() {
        if (extList.length < 1) {
            callback && callback(new exceptions.TemplateFileIsNotExists());
            return;
        }

        var ext = extList.shift();

        if (typeof ext !== 'string') {
            callback && callback(new exceptions.IncorrectTemplateFileExtensions());
            return;
        }

        fs.exists(filePath + ext, function (exists) {
            if (exists) {
                callback(null, filePath + ext);
                return;
            } 

            checkExists();
        });
    }

    checkExists();
}

/**
 * Render template file
 *
 * Arguments:
 *   file [String] template name or full template file path
 *     template name is filename (in directory: templateFilesDir) without or with extension
 *       possible values:
 *         'page' for page.html or page.tpl or page.OTHER_EXTENSION
 *         'dir/page' for page.html or page.tpl or page.OTHER_EXTENSION in directory
 *         '/home/username/node/njst/examples/templates/simple.html' for full template file path
 *         if templateFilesDir is null - then you need use only full template file path
 *   context [Object] key-value object of template context
 *   inputParams (optional) [Object] key-value object of custom parameters
 *     extends constructor example parameters just for this render
 *   callback (optional) [Function] callback function
 *     Arguments:
 *       err [Error, null] instance of Error constructor or null if no errors
 *       out [String] rendered code
 *
 * Public
 */
Constructor.prototype.renderFile
= function renderFile(file, context/*, inputParams, callback*/) {
    var self = this;

    /** prepare arguments */
    var args = renderPrepare.call(self, arguments);
    if (args === false) return;

    /** arguments validation */
    if (file instanceof Buffer) {
        file = file.toString();
    } else if (typeof file !== 'string') {
        provideError.call(self, new exceptions.IncorrectTemplateFilenameType(), args.inputParams, args.callback);
        return;
    }

    /** rendering wrapper */
    function parse(source) {
        parser.call(this, source, args.context, args.inputParams, function (err, rendered) {
            if (err) {
                provideError.call(self, err, args.inputParams, args.callback);
                return;
            }

            args.callback && process.nextTick(function () {
                args.callback(null, rendered);
            });
        });
    }

    /** get template files directory path */
    var templateFilesDir = null;
    var templateFilePath = file;
    if (typeof args.inputParams.templateFilesDir === 'string') {
        templateFilesDir = args.inputParams.templateFilesDir;
        templateFilePath = path.join(templateFilesDir, file);
    }

    /** read the template file */
    findFileExtension.call(
        self,
        templateFilePath,
        args.inputParams.templateFileExtensions,
        function (err, filePath) {
            if (err) {
                provideError.call(self, err, args.inputParams, args.callback);
                return;
            }

            fs.readFile(filePath, function (err, data) {
                if (err) {
                    provideError.call(self, new exceptions.ReadTemplateFileError(
                            'Reading template file error "'+ templateFilePath +'".'
                            + (err.message) ? ('\n'+err.message) : ''
                        ), args.inputParams, args.callback);
                    return;
                }

                parse.call(self, data);
            });
        }
    );
};

/**
 * Provide exceptions by constructor and example of constructor
 *
 * Public
 */
Constructor.exceptions = exceptions;
Constructor.prototype.exceptions = exceptions;

/** This module is a constructor */
module.exports = Constructor;
