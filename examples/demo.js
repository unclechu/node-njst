var njst = require('../lib/njst');
var fs = require('fs');
var http = require('http');

http.createServer(function (request, response) {	
	fs.readFile('../templates/demo.html', function (err, data) {
		if (err) return;
		
		var out;
		var context = {
			PageTitle: 'jJSt demonstration #1',
			List: [
				{Name:'First', Description:'it\'s a first step'},
				{Name:'Second', Description:'ok, next', List: ['One', 'Two', 'Three']},
				{Name:'End', Description:'last step'},
			],
			ShowCopyright: true,
			ShowHelloWorld: true,
			HelloWorld: 'Hello world! Yeah!',
		};
		
		out = njst.parse(data, context, {debug:1});
		response.writeHead(200, {'content-type':'text/html; charset=utf-8'});
		response.end(out);
	});
}).listen(8000);