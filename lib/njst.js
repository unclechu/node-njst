/*!

Node.JS module: nJSt (Native JavaScript Templates)
GitHub: https://github.com/unclechu/njst
Author: Viacheslav Lotsmanov (unclechu)
E-Mail: lotsmanov89@gmail.com
Blog: unclechumind.blogspot.com

Copyright (c) 2011 Viacheslav Lotsmanov (unclechu)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

var vm = require('vm');
var util = require('util');

var regs = {
	// #{...} simple
	simple: {
		all: /#{([^;\n]*?)}/g,
		first: /#{([^;\n]*?)}/,
		only: /^#{([^;\n]*?)}$/,

		escape: [
			{reg:/\r/g, val:'\\r'},
			{reg:/\n/g, val:'\\n'},
			{reg:/\t/g, val:'\\t'},
		],
	},

	// #> ... <# html
	html: {
		all: /#>([^\0]*?)<#/g,
		first: /#>([^\0]*?)<#/,
		only: /^#>([^\0]*?)<#$/,

		escape: [
			{reg:/\\/g, val:'\\\\'},
			{reg:/\r/g, val:'\\r'},
			{reg:/\n/g, val:'\\n'},
			{reg:/\t/g, val:'\\t'},
			{reg:/'/g, val:"\\'"},
		],

		unescape: [
			{reg:/\\\\/g, val:'\\'},
			{reg:/\\r/g, val:'\r'},
			{reg:/\\n/g, val:'\n'},
			{reg:/\\t/g, val:'\t'},
			{reg:/\\'/g, val:"'"},
		],
	},
};

var defaultParams = {
	debug: false,
	liteDebug: false,
};

exports.parse = function (content, context, inputParams) {
	content = content.toString();
	context = (typeof context === 'object') ? context : {};
	inputParams = (typeof inputParams === 'object') ? inputParams : {};

	var params = JSON.parse(JSON.stringify(defaultParams)); //clone object
	for (var key in inputParams) {
		params[key] = inputParams[key];
	}

	var inclusions, code, execResult, debugBuffer, initLog=[];

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
		if (params.debug && typeof systemContext[key] !== 'undefined') {
			debugBuffer = (typeof systemContext[key] === 'function') ? key+'()' : '"'+key+'"';
			initLog.push('nJSt warning: Template instrument '+ debugBuffer +' rewritten in input context.');
			console.log(initLog[initLog.length-1]);
		}
		systemContext[key] = context[key];
	}
	context = systemContext;

	//init instruments
	try {
		vm.runInNewContext(context.initInstruments(), context);
	} catch (e) {
		if (params.liteDebug || params.debug) {
			return ''
				+'<pre>'
					+'nJSt fatal error: Init template instruments error.\n\n'
					+((params.debug) ? 'Init log:\n'+ initLog +'\n\n' : '')
					+((params.debug) ? 'Error log: '+ util.inspect(e) : '')
				+'</pre>';
		} else {
			return 'Template fatal error.';
		}
	}

	//parsing
	content = '#>'+ content +'<#';
	content = htmlParse(content);
	try {
		content = context.initInstruments(content);
		content = vm.runInNewContext(content, context);
	} catch (e) {
		content = debugTemplateInclusions(params, e, initLog);
	}

	return content;
};

function htmlParse(str) {
	var inclusions;
	if (inclusions = str.match(regs.html.all)) {
		inclusions.forEach(function (val) {
			var code = val.replace(regs.html.only, '$1');
			code = htmlEscape(code);
			code = ";show('"+ code +"');";
			code = simpleParse(code);
			str = str.replace(regs.html.first, function () {
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
			code = htmlUnescape(code);
			code = simpleEscape(code);
			code = "'+("+ code +")+'";
			str = str.replace(regs.simple.first, function () {
				return code;
			});
		});
	}
	return str;
}

function htmlEscape(str) {
	regs.html.escape.forEach(function (val) {
		str = str.replace(val.reg, val.val);
	});
	return str;
}

function htmlUnescape(str) {
	regs.html.unescape.forEach(function (val) {
		str = str.replace(val.reg, val.val);
	});
	return str;
}

function simpleEscape(str) {
	regs.simple.escape.forEach(function (val) {
		str = str.replace(val.reg, val.val);
	});
	return str;
}

function debugTemplateInclusions(params, e, initLog) {
	if (params.liteDebug || params.debug) {
		return ''
			+'<pre>'
				+'nJSt error: Template parsing error.\n\n'
				+((params.debug) ? 'Init log:\n'+ initLog +'\n\n' : '')
				+((params.debug) ? 'Error log: '+ util.inspect(e) : '')
			+'</pre>';
	} else {
		return 'Template error.';
	}
}

exports.setDefaultParams = function (inputParams) {
	if (typeof inputParams !== 'object') {
		return false;
	}

	for (var key in inputParams) {
		defaultParams[key] = inputParams[key];
	}

	return true;
};