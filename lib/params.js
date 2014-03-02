/*!
 * Parameters of constructor examples
 *
 * License: GPLv3
 * Author: Viacheslav Lotsmanov
 */

var path = require('path');

var exceptions = require('./exceptions');

var defaultParams = {
    templateFilesDir: null,
    templateFileExtensions: ['.njst', '.njt', '.html', '.htm', '.tpl'],
    cacheFiles: false,
    cacheStorage: 'native',
    cachedFilesWatchType: 'fs',
    cacheFilesWatchInterval: 2000,
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
 */
module.exports.set =
function set(inputParams) {
    initParams.call(this);
    inputParams = (typeof inputParams === 'object') ? inputParams : {};

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
 */
module.exports.get =
function get() {
    initParams.call(this);
    var newObj = {};

    // cloning parameters
    for (var key in this._params) newObj[key] = this._params[key];

    return newObj;
};

/**
 * Returns extended constructor example parameters by inputParams
 *
 * Arguments:
 *   inputParams [Object] key-value object of input parameters
 *
 * Returns:
 *   [Object] extended parameters of constructor example
 *
 * this:
 *   Constructor example
 */
module.exports.extend =
function extend(inputParams) {
    initParams.call(this);
    inputParams = (typeof inputParams === 'object') ? inputParams : {};

    var newObj = {};

    // validate input parameters
    for (var key in inputParams) {
        if ( ! (key in defaultParams))
            throw new exceptions.UnknownParameterKey('Unknown parameter key "'+ key +'".');
    }

    // cloning parameters
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
 */
function initParams() {
    if (typeof this._params !== 'object') {
        this._params = {};

        // cloning parameters by defaults
        for (var key in defaultParams) this._params[key] = defaultParams[key];
    }
}
