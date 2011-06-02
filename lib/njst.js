/**

Node.JS module: nJSt (Native JavaScript Templates)
Version: 0.1
GitHub: http://github.com/unclechu/njst/
Author: Viacheslav Lotsmanov (unclechu)
E-Mail: lotsmanov89@gmail.com
Blog: unclechumind.blogspot.com

MIT License: http://www.opensource.org/licenses/mit-license.php

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
	// <# ... #> tags
	tagsAll: /<#([^\0]*?)#>/g,
	tagsFirst: /<#([^\0]*?)#>/,
	tagsOnly: /^<#([^\0]*?)#>$/,
	
	// #{...} simple
	simpleAll: /#{([^;\n]*?)}/g,
	simpleFirst: /#{([^;\n]*?)}/,
	simpleOnly: /^#{([^;\n]*?)}$/,
	
	// &> ... <# pure html
	pureHtmlAll: /&>([^\0]*?)<&/g,
	pureHtmlFirst: /&>([^\0]*?)<&/,
	pureHtmlOnly: /^&>([^\0]*?)<&$/,
	pureHtmlString: [
		{reg:/\r/g, val:'\\r'},
		{reg:/\n/g, val:'\\n'},
		{reg:/\t/g, val:'\\t'},
		{reg:/'/g, val:"\\'"},
	],
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
	
	var inclusions, code, execResult, debugBuffer, errLog=[];
	
	var systemContext = new function () {
		this.initInstruments = function (code/*, toggle*/) {
			var toggle = {show:true, isolation:true};
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
					header = ';(function () {' + header + 'return ';
					footer += ';})();';
				}
			}
			
			return header + code + footer;
		};
		this.show = function () {};
		this.toShow = '';
		this.subParse = subParse;
	};
	
	//merge input and system context
	for (var key in context) {
		if (params.debug && typeof systemContext[key] !== 'undefined') {
			debugBuffer = (typeof systemContext[key] === 'function') ? key+'()' : '"'+key+'"';
			errLog.push('nJSt warning: Template instrument '+ debugBuffer +' rewritten in input context.');
			console.log(errLog[errLog.length-1]);
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
					+((params.debug) ? 'Init log:\n'+ errLog +'\n\n' : '')
					+((params.debug) ? 'Error log: '+ util.inspect(e) : '')
				+'</pre>';
		} else {
			return 'Template fatal error.';
		}
	}
	
	//tags
	inclusions = content.match(regs.tagsAll);
	if (inclusions) {
		for (var i=0; i<inclusions.length; i++) {
			jsCode = inclusions[i].replace(regs.tagsOnly, '$1');
			jsCode = subParse(jsCode);
			
			try {
				jsCode = context.initInstruments(jsCode);
				execResult = vm.runInNewContext(jsCode, context);
			} catch (e) {
				execResult = debugTemplateInclusions(params, e);
			}
			content = content.replace(regs.tagsFirst, execResult);
		}
	}
	
	//simple
	inclusions = content.match(regs.simpleAll);
	if (inclusions) {
		for (var i=0; i<inclusions.length; i++) {
			jsCode = inclusions[i].replace(regs.simpleOnly, '$1');
			try {
				jsCode = context.initInstruments(jsCode, {show:false});
				execResult = vm.runInNewContext(jsCode, context);
			} catch (e) {
				execResult = debugTemplateInclusions(params, e);
			}
			content = content.replace(regs.simpleFirst, execResult);
		}
	}
	
	return content;
};

function subParse(str) {
	str = str.toString();
	if (regs.pureHtmlAll.test(str)) {
		var inclusions = str.match(regs.pureHtmlAll);
		for (var i=0; i<inclusions.length; i++) {
			var code = inclusions[i].replace(regs.pureHtmlOnly, '$1');
			code = stringEscape(code);
			code = ";show('"+ code +"');";
			code = simpleParse(code);
			str = str.replace(regs.pureHtmlFirst, code);
		}
	}
	return str;
}

function simpleParse(str) {
	str = str.toString();
	if (regs.simpleAll.test(str)) {
		inclusions = str.match(regs.simpleAll);
		for (var i=0; i<inclusions.length; i++) {
			var code = inclusions[i].replace(regs.simpleOnly, '$1');
			code = "'+"+ code +"+'";
			str = str.replace(regs.simpleFirst, code);
		}
	}
	return str;
}

function stringEscape(str) {
	str = str.toString();
	var regArr = regs.pureHtmlString;
	for (var i=0; i<regArr.length; i++) {
		str = str.replace(regArr[i].reg, regArr[i].val);
	}
	return str;
}

function debugTemplateInclusions(params, err) {
	if (params.debug) {
		return 'TEMPLATE-CODE-ERROR: ' + util.inspect(err).replace(/\n/g, ' ').replace(/ +/g, ' ');
	} else if (params.liteDebug) {
		return 'TEMPLATE-CODE-ERROR';
	} else {
		return '';
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