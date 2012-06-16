/**
 * @overview General module of nJSt
 * @version 0.2
 * @author Viacheslav Lotsmanov (unclechu)
 */

var parser = require('./parser')
  , params = require('./params');

/**
 * Constructor of module. Can use as example of module:
 *   module.exports.parse('...');
 * and like this:
 *   var njst = new module.exports;
 *   njst.parse('...');
 *
 * @constructor
 * @param {object} inputParams
 * @this Constructor
 * @method parse
 * @method setDefaultParams only Constructor has, but not new examples
 * @method getDefaultParams only Constructor has, but not new examples
 * @method setParams
 * @method getParams
 */
function Constructor(inputParams) {
	params.set.call(this, inputParams);
}

/**
 * Sets default parameters for new examples of constructor.
 *
 * @param {object} inputParams
 */
Constructor.setDefaultParams = function (inputParams) {
	params.set.call(this, inputParams, true);
};

/**
 * Returns default parameters for new examples of constructor.
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
 * Parser method of pre-created example of constructor.
 *
 * @param {string} content
 * @param {object} context
 * @param {object} inputParams
 */
Constructor.parse = function (content, context, inputParams) {
	content = content.toString();
	context = (typeof context === 'object') ? context : {};

	var parseParams = params.get.call(this);
	parseParams = params.extend.call(this, inputParams);

	return parser.call(this, content, context, parseParams);
};
Constructor.prototype.parse = Constructor.parse;

//can create new object by itself: new module.exports
module.exports = Constructor;