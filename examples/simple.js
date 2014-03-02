#!/usr/bin/env node

/*!
 * nJSt demonstration
 * Usage example
 */

var path = require('path');
var http = require('http');
var njst = require('../');

var host = null;
var port = 8000;

/**
 * For Cloud9 IDE
 * If you run this on Cloud9 IDE -
 *   you should to start this script with --c9ide argument
 */
process.argv.forEach(function (val) {
    if (val == '--c9ide') {
        host = '0.0.0.0';
        port = process.env.PORT;
    }
});

var template = new njst({
    templateFilesDir: path.join(path.dirname(module.filename), 'templates')
});

var context = {
    page_title: 'nJSt demonstration',
    list: [
        {
            name: 'foo',
            text: 'hello world!'
        },
        {
            name: 'bar',
            text: 'njst demonstration',
            sublist: [
                'one',
                'two',
                'three'
            ]
        },
        {
            name: 'last',
            text: 'last of this list'
        }
    ],
    show_counter: true,
    counter: 0
};

http.createServer(function (request, response) {
    context.counter += 1;
    template.renderFile('simple', context, {debug: true}, function (err, out) {
        if (err) {
            response.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
            var errMessage = (err.message) ? '\n'+err.message : '';
            if (err instanceof template.exceptions.TemplateFileIsNotExists) {
                response.end('Server error: template file is not exists.' + errMessage);
            } else if (err instanceof template.exceptions.ReadTemplateFileError) {
                response.end('Server error: cannot read template file.' + errMessage);
            } else if (err instanceof template.exceptions.ParseTemplateSyntaxError) {
                response.end('Server error: parse template syntax error.' + errMessage);
            } else {
                response.end('Server error: unknown template render error.' + errMessage);
            }
            return;
        }

        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(out);
    });
}).listen(port, host);
