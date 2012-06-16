# nJSt (Native JavaScript Templates) v0.2

## Installing

	npm install njst

## Usage

### HTML page.html

	<html>
	<head>
		<title>#{PageTitle}</title>
	</head>

	<body>
		<h1>#{PageTitle}</h1>

		<ul>
		<# for (var i=0; i<List.length; i++) { #>
			<li>
				<#
					if (typeof List[i] !== 'object') {
						show(List[i]);
					} else {
						show(List[i].name +' - '+ List[i].note);
					}
				#>
			</li>
		<# } #>
		</ul>
	</body>
	</html>

### Node.JS test.js

	var njst = require('njst');
	var fs = require('fs');
	var http = require('http');

	http.createServer(function (request, response) {
		fs.readFile('./page.html', function (err, data) {
			if (err) return;
			var out;
			var context = {
				PageTitle: 'jJSt demonstration #1',
				List: ['First', {name:'Second', note:'2th'}, 'Third']
			};

			out = njst.parse(data, context, {debug: true});
			response.writeHead(200, {'content-type': 'text/html; charset=utf-8'});
			response.end(out.toString());
		});
	}).listen(8000);

## Author

Viacheslav Lotsmanov (unclechu)