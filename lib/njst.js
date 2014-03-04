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

/**
 * General constructor
 *
 * Arguments:
 *   inputParams [Object] key-value object of input parameters
 *     templateFilesDir: [String, null] (default: null) full path to template files directory
 *       by default (null) you need use full path of your template files
 *     templateFileExtensions: [Array, null] (default: null)
 *       specific extensions for template file names, possible and default value:
 *          ['.njst', '.njt', '.html', '.htm', '.tpl']
 *     cacheFiles: [Boolean] (default: false) cache template files
 *     cacheStorage: [String] (default: 'native') cache storage, possible values:
 *       'native': cache to native JS object
 *       'redis': cache to redis TODO
 *     cachedFilesWatchType: [String] (default: 'fs') detecting changes in template files, types:
 *       'fs': watch for changes by file system node.js module
 *       'timer': watch for changes every N (see cacheFilesWatchInterval parameter) milliseconds
 *     cacheFilesWatchInterval: [Number] (default: 2000) milliseconds interval
 *       for 'timer' mode of cacheFilesWatchType
 *     debug: [Boolean] (default: false) debug mode
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
 */
function Constructor(inputParams) {
    params.set.call(this, inputParams);
}

/**
 * Sets parameters for example of constructor
 *
 * Arguments:
 *   inputParams [Object] key-value object of input parameters
 */
Constructor.prototype.setParams
function setParams(inputParams) {
    params.set.call(this, inputParams);
};

/**
 * Returns parameters of constructor example
 *
 * Returns:
 *   [Object] key-value object of constructor example parameters
 */
Constructor.prototype.getParams =
function getParams() {
    return params.get.call(this);
};

/**
 * Private helper for prepare arguments of render methods
 */
function renderPrepare(arguments) {
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
    if (typeof result.inputParams !== 'object'
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

    /** merging constructor example parameters and input parameters */
    result.inputParams = params.extend.call(this, result.inputParams);

    return result;
};

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
 */
Constructor.prototype.render =
function render(source, context/*, inputParams, callback*/) {
    /** prepare arguments */
    var args = renderPrepare.call(this, arguments);
    if (args === false) return;

    /** arguments validation */
    if (source instanceof Buffer) {
        source = source.toString();
    } else if (typeof source !== 'string') {
        args.callback && process.nextTick(function () {
            args.callback(new exceptions.IncorrectTemplateCodeType());
        });
        return;
    }

    /** rendering */
    parser.call(this, source, args.context, args.inputParams, function (err, rendered) {
        args.callback && process.nextTick(function () {
            args.callback(null, rendered);
        });
    });
};

function findFileExtension(filePath, extList, callback) {
    if (!Array.isArray(extList)) {
        if (typeof extList !== null) {
            callback(new exceptions.IncorrectTemplateFileExtensions());
            return;
        }
        extList = [];
    }
    extList = Array.prototype.slice.call(extList, 0); // clone the array

    extList.push(''); // without extension is the last chance

    function checkExists() {
        if (extList.length < 1) {
            callback(new exceptions.TemplateFileIsNotExists());
            return;
        }

        var ext = extList.shift();

        if (typeof ext !== 'string') {
            callback(new exceptions.IncorrectTemplateFileExtensions());
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
 */
Constructor.prototype.renderFile =
function renderFile(file, context/*, inputParams, callback*/) {
    /** prepare arguments */
    var args = renderPrepare.call(this, arguments);
    if (args === false) return;

    /** arguments validation */
    if (file instanceof Buffer) {
        file = file.toString();
    } else if (typeof file !== 'string') {
        args.callback && process.nextTick(function () {
            args.callback(new exceptions.IncorrectTemplateFilenameType());
        });
        return;
    }

    /** rendering wrapper */
    function parse(source) {
        parser.call(this, source, args.context, args.inputParams, function (err, rendered) {
            if (err) {
                args.callback && process.nextTick(function () {
                    args.callback(err);
                });
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
    findFileExtension(templateFilePath, args.inputParams.templateFileExtensions, function (err, filePath) {
        if (err) {
            args.callback && process.nextTick(function () {
                args.callback(err);
            });
            return;
        }

        fs.readFile(filePath, function (err, data) {
            if (err) {
                args.callback && process.nextTick(function () {
                    args.callback(new exceptions.ReadTemplateFileError(
                        'Reading template file error "'+ templateFilePath +'".'
                        + (err.message) ? ('\n'+err.message) : ''
                    ));
                });
                return;
            }

            parse.call(this, data);
        });
    });
};

/** forwarding exceptions */
Constructor.exceptions = exceptions;
Constructor.prototype.exceptions = exceptions;

/** this module is a constructor */
module.exports = Constructor;
