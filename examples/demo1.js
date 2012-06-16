var fs = require('fs')
  , path = require('path')
  , http = require('http')
  , njst = require('../lib/njst');

var moduleDirPath = path.dirname(module.filename)
  , templatePath = path.join(moduleDirPath, './templates/demo1.html');

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
			PageTitle: 'nJSt demonstration #1',
			List: [
				{Name:'First', Description:'it\'s a first step'},
				{Name:'Second', Description:'ok, next', List: ['One', 'Two', 'Three']},
				{Name:'End', Description:'last step'},
			],
			ShowCopyright: true,
			ShowHelloWorld: true,
			HelloWorld: 'Hello world! Yeah!'
		};

		out = njst.parse(data, context, {debug: true});
		response.writeHead(200, {'content-type':'text/html; charset=utf-8'});
		response.end(out.toString());
	});
}).listen(port, host);