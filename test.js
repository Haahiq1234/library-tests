var http = require('http');
let fs = require('fs');

http.createServer(function (req, res) {
    let fl = req.url.replace("/", "");
    console.log(typeof fl);
    //if (".html" in fl) {
    //    fs.readFile(fl, function (err, data) {
    //        res.writeHead(200, { 'Content-Type': 'text/html' });
    //        res.write(data);
    //        return res.end();
    //    });
    //}
    //res.writeHead(200, { 'Content-Type': 'text/html' });
    //res.end();
}).listen(8080);