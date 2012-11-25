# nJSt (Native JavaScript Templates) v0.2.1

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
        <# List.forEach(function (item) { #>
            <li>#{item}</li>
        <# }) #>
        </ul>

        <# if (ShowMessage) { #>
            <p>nJSt loves you!</p>
        <# } #>
    </body>
    </html>

### Node.JS test.js

    var njst = require('njst');
    var fs = require('fs');
    var http = require('http');

    http.createServer(function (request, response) {
        fs.readFile('./page.html', function (err, data) {
            if (err) {
                res.writeHead(500, {'content-type': 'text/html; charset=utf-8'});
                res.end(err.toString());
            }

            var context = {
                PageTitle: 'nJSt demonstration',
                List: ['One', 'Two', 'Three'],
                ShowMessage: true
            };

            njst.render(data, context, {debug: true}, function (err, out) {
                response.writeHead(200, {'content-type': 'text/html; charset=utf-8'});
                response.end(out);
            });
        });
    }).listen(8000);

## Author

Viacheslav Lotsmanov (unclechu)