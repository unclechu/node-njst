var fs = require('fs')
  , path = require('path')
  , http = require('http')
  , util = require('util')
  , njst = require('../lib/njst');

var moduleDirPath = path.dirname(module.filename)
  , templatePath = path.join(moduleDirPath, './templates/demo3.html');

var host = null,
	port = 8000;

process.argv.forEach(function (val) {
	if (val == '-c9ide') {
		host = '0.0.0.0';
		port = process.env.PORT;
	}
});

http.createServer(function (request, response) {
	fs.readFile(templatePath, function (err, data) {
		if (err) {
			response.writeHead(500, {'content-type':'text/html; charset=utf-8'});
			response.end(err.toString());
		}

		var out
		  , context;

		context = {
			PageTitle: 'nJSt demonstration #3',
			Description: 'Many examples of nJSt with own parameters.',
			List: []
		};

		//#1
		context.List.push({
			title: 'Default nJSt parameters for new examples.',
			command: 'njst.getDefaultParams();',
			result: util.inspect(njst.getDefaultParams())
		});

		//#2
		var obj = new njst({liteDebug: true});
		context.List.push({
			title: 'Parameters of the new example.',
			command: 'var obj = new njst({liteDebug: true});'
				+'\nobj.getParams();',
			result: util.inspect(obj.getParams())
		});

		//#3
		var obj2 = new njst({debug: true});
		context.List.push({
			title: 'And one more example.',
			command: 'var obj2 = new njst({debug: true});'
				+'\nobj2.getParams();',
			result: util.inspect(obj2.getParams())
		});

		//#4
		context.List.push({
			title: 'Check default parameters and nJSt examples parameters.',
			command: 'njst.getDefaultParams();'
				+'\nobj.getParams();'
				+'\nobj2.getParams();',
			result: util.inspect(njst.getDefaultParams())
				+'\n\n'+ util.inspect(obj.getParams())
				+'\n\n'+ util.inspect(obj2.getParams())
		});

		//#5
		njst.setDefaultParams({debug: true});
		context.List.push({
			title: 'Change default parameters for new examples'
				+' and check all that we have.',
			command: 'njst.setDefaultParams({debug: true});'
				+'\nnjst.getDefaultParams();'
				+'\nobj.getParams();'
				+'\nobj2.getParams();',
			result: util.inspect(njst.getDefaultParams())
				+'\n\n'+ util.inspect(obj.getParams())
				+'\n\n'+ util.inspect(obj2.getParams())
		});

		//#6
		var obj3 = new njst();
		var obj4 = new njst({debug: false});
		context.List.push({
			title: 'Create two new examples with new default parameters.',
			command: 'var obj3 = new njst();'
				+'\nvar obj4 = new njst({debug: false});'
				+'\nobj3.getParams();'
				+'\nobj4.getParams();',
			result: util.inspect(obj3.getParams())
				+'\n\n'+ util.inspect(obj4.getParams())
		});

		//#7
		context.List.push({
			title: '"njst" constructor can be used as his example.',
			command: 'njst.getParams();',
			result: util.inspect(njst.getParams())
		});

		out = njst.parse(data, context);
		response.writeHead(200, {'content-type':'text/html; charset=utf-8'});
		response.end(out.toString());
	});
}).listen(port, host);