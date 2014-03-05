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

http.createServer(function (req, res) {
    context.counter += 1;
    template.renderFile('simple', context, function (err, out) {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
            var errMessage = (err.message) ? '\n'+err.message : '';
            if (err instanceof template.exceptions.TemplateFileIsNotExists) {
                res.end('Server error: template file is not exists.' + errMessage);
            } else if (err instanceof template.exceptions.ReadTemplateFileError) {
                res.end('Server error: cannot read template file.' + errMessage);
            } else if (err instanceof template.exceptions.ParseTemplateSyntaxError) {
                res.end('Server error: parse template syntax error.' + errMessage);
            } else {
                res.end('Server error: unknown template render error.' + errMessage);
            }
            return;
        }

        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(out);
    });
}).listen(port, host);
