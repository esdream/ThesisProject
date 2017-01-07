var http = require('http');
var url = require('url');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.send();
}).listen(3000);
