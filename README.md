nJSt (Native JavaScript Templates)
==================================

Installing
----------

    npm install njst

Usage
-----

### template.njst

```
<!doctype html>
<html>
<head>
    <title>%{page_title}</title>
</head>

<body>
    <h1>%{page_title}</h1>

    <ul>
    <% list.forEach(function (item) { %>
        <li>%{item}</li>
    <% }) %>
    </ul>

    <% if (show_message) { %>
        <p>nJSt loves you!</p>
    <% } %>
</body>
</html>
```

### test.js

```
var path = require('path');
var http = require('http');
var njst = require('njst');

var template = new njst({ debug: true });
var templateFilePath = path.join(path.dirname(module.filename), 'template');

http.createServer(function (req, res) {
    var context = {
        page_title: 'nJSt demonstration',
        list: ['foo', 'bar', 'foobar'],
        show_message: true
    };

    template.renderFile(templateFilePath, context, function (err, out) {
        if (err && err instanceof njst.exceptions.DebuggedError) {
            res.writeHead(500, {'Content-Type': err.mimeType + '; charset=utf-8'});
        } else if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
            res.end( err.toString() );
            return;
        } else {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        }

        res.end(out);
    });
}).listen(8000);
```

### Run

    node ./test.js

More examples
-------------

[Simple](examples/simple.js)

Authors
-------

Viacheslav Lotsmanov

See also
--------

https://github.com/visionmedia/ejs
