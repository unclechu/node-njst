#!/usr/bin/env node

/**
 * nJSt Demonstration - simple template:
 * Display of values;
 * Arrays and key-value objects in context and loops in templates.
 */

var fs = require('fs');
var path = require('path');
var http = require('http');
var njst = require('../lib/njst');

var moduleDirPath = path.dirname(module.filename);
var templatePath = path.join(moduleDirPath, './templates/simple.html');

var host = null;
var port = 8000;

//support Cloud9 IDE
process.argv.forEach(function (val) {
    if (val == '-c9ide') {
        host = '0.0.0.0';
        port = process.env.PORT;
    }
});

http.createServer(function (request, response) {
    fs.readFile(templatePath, function (err, data) {
        if (err) {
            response.writeHead(500, {'content-type': 'text/html; charset=utf-8'});
            response.end(err.toString());
        }

        var context = {
            PageTitle: 'nJSt demonstration',
            List: [
                {
                    Name: 'First',
                    Text: 'Hello world!'
                },
                {
                    Name: 'Second',
                    Text: 'Next?',
                    SubList: [
                        'One',
                        'Two',
                        'Three'
                    ]
                },
                {
                    Name: 'End',
                    Text: 'Last of this list.'
                }
            ],
            ShowCopyright: true
        };

        njst.render(data, context, {debug: true}, function (err, out) {
            if (err) {
                response.writeHead(500, {'content-type': 'text/html; charset=utf-8'});
                response.end(err.toString());
                return;
            }

            response.writeHead(200, {'content-type': 'text/html; charset=utf-8'});
            response.end(out);
        });
    });
}).listen(port, host);