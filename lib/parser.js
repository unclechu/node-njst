/**
 * @overview Parser module.
 */

var vm = require('vm')
  , fs = require('fs')
  , regs = require('./regs')
  , params = require('./params')
  , escapers = require('./escapers');

/**
 * Parser function.
 *
 * @param {string} content
 * @param {object} context
 * @param {object} inputParams
 * @this Constructor or Constructor example
 */
var parser = module.exports = function (content, context, inputParams) {
	content = content.toString();
	context = (typeof context === 'object') ? context : {};
	inputParams = (typeof inputParams === 'object') ? inputParams : {};

	inputParams = params.extend.call(this, inputParams);

	var initLog = [];

	var systemContext = new function () {
		this.initInstruments = function (code/*, toggle*/) {
			var toggle = {
				show: true,
				isolation: true,
			};
			if (typeof arguments[1] === 'object') {
				for (var key in arguments[1]) {
					toggle[key] = arguments[1][key];
				}
			}

			var header='', footer='';

			header += ';toShow="";';
			if (toggle.show) {
				header += ';function show(value) { return toShow += value; };';
				footer += ';toShow;';
			} else {
				header += ';function show() {};';
				header += ';show();';
			}

			if (toggle.isolation) {
				if (toggle.show) {
					header = ';(function () {' + header;
					footer += ';return toShow;})();';
				} else {
					header = ';(function () {' + header + ';return ';
					footer += ';})();';
				}
			}

			return header + code + footer;
		};
		this.show = function () {};
		this.toShow = '';
	};

	//merge input and system context
	for (var key in context) {
		if (inputParams.debug && typeof systemContext[key] !== 'undefined') {
			initLog.push('Warning: Template instrument '
				+((typeof systemContext[key] === 'function')
					? key+'()' : '"'+key+'"')
				+' overwritten in the input context.');
		}
		systemContext[key] = context[key];
	}
	context = systemContext;

	//init template system instruments
	try {
		vm.runInNewContext(context.initInstruments(), context);
	} catch (err) {
		if (inputParams.debugTemplateParse) {
			return complexReturn(
				'nJSt: Debug template parsing error.',
				{status: 'error'});
		}

		try {
			var debugTemplateSrc = fs.readFileSync(inputParams.debugTemplate);
		} catch (err) {
			return complexReturn(
				'nJSt: Can\'t load debug template file.',
				{status: 'error'});
		}

		inputParams.debugTemplateParse = true;
		return complexReturn(parser.call(this, debugTemplateSrc, {
			params: inputParams,
			errorTitle: 'Fatal error',
			errorMessage: 'Init template instruments error.',
			initLog: initLog,
			error: err
		}, inputParams), {status: 'error'});
	}

	//parsing
	content = '#>'+ content +'<#';
	content = compileParse(content);
	try {
		content = context.initInstruments(content);
		content = vm.runInNewContext(content, context);
	} catch (err) {
		if (inputParams.debugTemplateParse) {
			return complexReturn(
				'nJSt: Debug template parsing error.',
				{status: 'error'});
		}

		try {
			var debugTemplateSrc = fs.readFileSync(inputParams.debugTemplate);
		} catch (err) {
			return complexReturn(
				'nJSt: Can\'t load debug template file.',
				{status: 'error'});
		}

		inputParams.debugTemplateParse = true;
		return complexReturn(parser.call(this, debugTemplateSrc, {
			params: inputParams,
			errorTitle: 'Error',
			errorMessage: 'Template parsing error.',
			initLog: initLog,
			error: err
		}, inputParams), {status: 'error'});
	}

	return complexReturn(content, {status: 'success'});
};

/**
 * Merge and returns result parsed string as object with additional properties.
 *
 * @property {string} result.status is "success" or "error"
 * @returns {string} String-object with additional properties
 */
function complexReturn(result, data) {
	var complex = new String(result);
	for (var key in data) {
		complex[key] = data[key];
	}
	return complex;
}

function compileParse(str) {
	var inclusions;
	if (inclusions = str.match(regs.compile.all)) {
		inclusions.forEach(function (val) {
			var code = val.replace(regs.compile.only, '$1');
			code = escapers.compileEscape(code);
			code = ";show('"+ code +"');";
			code = simpleParse(code);
			str = str.replace(regs.compile.first, function () {
				return code;
			});
		});
	}
	return str;
}

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