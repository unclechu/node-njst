var fs = require('fs')
  , path = require('path')
  , http = require('http')
  , njst = require('../lib/njst');

var moduleDirPath = path.dirname(module.filename)
  , templatePath = path.join(moduleDirPath, './templates/demo2.html');

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
		  , download = false
		  , context;

		context = {
			PageTitle: 'nJSt demonstration #2',
			DownloadPage: function () {
				download = true;
			}
		};

		out = njst.parse(data, context);

		if (download) {
			response.writeHead(200, {
				'content-type': 'application/octet-stream; charset=utf-8',
				'content-disposition': 'attachment; filename="page.html"',
				'accept-ranges': 'bytes',
				'content-length': Buffer.byteLength(out.toString())
			});
		} else {
			response.writeHead(200, {'content-type':'text/html; charset=utf-8'});
		}
		response.end(out.toString());
	});
}).listen(port, host);