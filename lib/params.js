/**
 * @overview Parameters of constructor examples.
 */

var path = require('path');

module.exports = {};

var defaultParams = {
	debug: false,
	liteDebug: false,
	debugTemplate: '../templates/debug.tpl',
	debugTemplateParse: false
};

defaultParams.debugTemplate = path.join(
	path.dirname(module.filename),
	defaultParams.debugTemplate);

/**
 * @param {object} inputParams
 * @param {boolean} setDefault Set default parameters
 * @this Constructor or Constructor example
 */
module.exports.set = function (inputParams, setDefault) {
	initParams.call(this);
	inputParams = (typeof inputParams === 'object') ? inputParams : {};

	for (var key in defaultParams) {
		if (key in defaultParams
		&& typeof inputParams[key] === typeof defaultParams[key]) {
			if (setDefault) {
				defaultParams[key] = inputParams[key];
			} else {
				this._params[key] = inputParams[key];
			}
		}
	}
};

/**
 * @param {boolean} getDefault Get default parameters
 * @returns {object} Default parameters
 * @this Constructor or Constructor example
 */
module.exports.get = function (getDefault) {
	initParams.call(this);
	var newObj = {};

	if (getDefault) {
		for (var key in defaultParams) newObj[key] = defaultParams[key];
	} else {
		for (var key in this._params) newObj[key] = this._params[key];
	}

	return newObj;
};

/**
 * @param {object} inputParams
 * @returns {object} Extended params
 * @this Constructor or Constructor example
 */
module.exports.extend = function (inputParams, fromDefault) {
	initParams.call(this);
	inputParams = (typeof inputParams === 'object') ? inputParams : {};

	var newObj = {};
	for (var key in defaultParams) {
		if (key in defaultParams
		&& typeof inputParams[key] === typeof defaultParams[key]) {
			newObj[key] = inputParams[key];
		} else if (fromDefault) {
			newObj[key] = defaultParams[key];
		} else {
			newObj[key] = this._params[key];
		}
	}
	return newObj;
};

/**
 * Create parameters object for constructor example by default parameters.
 *
 * @this Constructor or Constructor example
 */
function initParams() {
	if (typeof this._params !== 'object') {
		this._params = {};
		for (var key in defaultParams) this._params[key] = defaultParams[key];
	}
}