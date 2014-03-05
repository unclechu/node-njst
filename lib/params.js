/*!
 * Parameters of constructor examples
 *
 * License: GPLv3
 * Author: Viacheslav Lotsmanov
 */

var exceptions = require('./exceptions');

var defaultParams = {

    /**
     * [String, null] full path to template files directory
     *   by default (null) you need use full path to every template file
     */
    templateFilesDir: null,

    /**
     * [Array, null] specific extensions for template file names
     */
    templateFileExtensions: ['.njst', '.njt', '.html', '.htm', '.tpl'],

    /**
     * [Boolean] enable caching of template files
     */
    cacheFiles: false,

    /**
     * [String] cache storage type
     *   Accepted values:
     *     'native': cache to native JS object
     */
    cacheStorage: 'native',

    /**
     * [String] detecting changes in template files
     *   Accepted values:
     *     'fs': watch for changes in template files by "stat" from node.js module "fs"
     *     'timer': watch for changes every N milliseconds (see cacheFilesWatchInterval parameter)
     */
    cachedFilesWatchType: 'fs',

    /**
     * [Number] interval in milliseconds
     *   only for 'timer' mode of "cacheFilesWatchType" parameter
     */
    cacheFilesWatchInterval: 2000,

    /**
     * [Boolean] debug mode
     *   if true then use debug template for error reporting (you need to catch DebuggedError exception)
     *   if false then provide all exceptions to callback
     */
    debug: false

};

/**
 * Sets parameters values to constructor example
 *
 * Arguments:
 *   inputParams [Object] ket-value object of parameters to set
 *
 * this:
 *   Constructor example
 *
 * Public
 */
module.exports.set
= function set(inputParams) {
    initParams.call(this);

    if (typeof inputParams !== 'object' && inputParams !== null)
        throw new exceptions.IncorrectInputParams();
    inputParams = (inputParams !== null) ? inputParams : {};

    for (var key in inputParams) {
        if (key in defaultParams) {
            this._params[key] = inputParams[key];
        } else {
            throw new exceptions.UnknownParameterKey('Unknown parameter key "'+ key +'".');
        }
    }
};

/**
 * Returns current parameters of constructor example
 *
 * Returns:
 *   [Object] key-value object of contructor example parameters
 *
 * this:
 *   Constructor example
 *
 * Public
 */
module.exports.get
= function get() {
    initParams.call(this);
    var newObj = {};

    /** cloning parameters */
    for (var key in this._params) newObj[key] = this._params[key];

    return newObj;
};

/**
 * Extend constructor example parameters by inputParams without save
 *
 * Arguments:
 *   inputParams [Object] key-value object of input parameters
 *
 * Returns:
 *   [Object] extended parameters of constructor example
 *
 * this:
 *   Constructor example
 *
 * Public
 */
module.exports.extend
= function extend(inputParams) {
    initParams.call(this);

    if (typeof inputParams !== 'object' && inputParams !== null)
        throw new exceptions.IncorrectInputParams();
    inputParams = (inputParams !== null) ? inputParams : {};

    var newObj = {};

    /** validate input parameters */
    for (var key in inputParams) {
        if ( ! (key in defaultParams))
            throw new exceptions.UnknownParameterKey('Unknown parameter key "'+ key +'".');
    }

    /** cloning parameters */
    for (var key in defaultParams) {
        if (key in inputParams) {
            newObj[key] = inputParams[key];
        } else {
            newObj[key] = this._params[key];
        }
    }

    return newObj;
};

/**
 * Initialize private params property of constructor example
 *
 * this:
 *   Constructor example
 *
 * Private
 */
function initParams() {
    if (typeof this._params !== 'object') {
        this._params = {};

        /** cloning parameters by defaults */
        for (var key in defaultParams) this._params[key] = defaultParams[key];
    }
}
