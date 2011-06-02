var njst = require('../lib/njst');
var fs = require('fs');
var http = require('http');

http.createServer(function (request, response) {
	fs.readFile('../templates/demo.html', function (err, data) {
		if (err) return;
		
		var context = {
			PageTitle: 'jJSt testing',
			list: [
				{name:'First', description:'it\'s a first step'},
				{name:'Second', description:'ok, next', list: [1,2,3,4,'hahahoho']},
				{name:'End', description:'last step'},
			],
			ShowIf: true,
			//show: 123,
			//toShow: 123,
		};
		
		response.writeHead(200, {'content-type':'text/html; charset=utf-8'});
		response.end(njst.parse(data, context, {debug:1}));
	});
}).listen(8000);