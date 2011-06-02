var njst = require('../lib/njst');
var fs = require('fs');
var http = require('http');

http.createServer(function (request, response) {	
	fs.readFile('./templates/demo2.html', function (err, data) {
		if (err) return;
		
		var out;
		var download = false;
		
		var context = {
			PageTitle: 'jJSt demonstration #2',
			DownloadPage: function () {
				download = true;
			},
		};
		
		out = njst.parse(data, context);
		
		if (download) {
			response.writeHead(200, {
				'content-type': 'application/octet-stream; charset=utf-8',
				'content-disposition': 'attachment; filename="page.html"',
				'accept-ranges': 'bytes',
				'content-length': Buffer.byteLength(out),
			});
		} else {
			response.writeHead(200, {'content-type':'text/html; charset=utf-8'});
		}
		response.end(out);
	});
}).listen(8000);