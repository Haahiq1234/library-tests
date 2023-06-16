const http = require('http');
const express = require('express');
const fs = require('fs');
const process = require('process')
process.chdir(__dirname + "/../");
//console.log();

const app = express();
const server = http.createServer(app);
function HandleFileRequests(req, res, MIMEType) {
    let url = req.url.replace("/", "");
    console.log(url);
    if (fs.existsSync(url)) {
        res.setHeader("status", 200);
        res.setHeader("Content-Type", MIMEType);
        let txt = fs.readFileSync(url);
        res.end(txt);
    } else {
        res.setHeader("status", 404);
        res.end("Error 404(Not Found)");
    }
}

app.get("*.js", (req, res) => HandleFileRequests(req, res, "text/html"));
app.get("*.css", (req, res) => HandleFileRequests(req, res, "text/css"));
app.get("*/", function (req, res) {
    let url = req.url.replace("/", "");
    console.log("Directory: " + url);
    if (fs.existsSync(url)) {
        if (fs.existsSync(url + "/index.html")) {
            res.setHeader("status", 200);
            res.setHeader("Content-Type", "text/html");
            let txt = fs.readFileSync(url + '/index.html');
            res.end(txt);
        } else {
            let files = fs.readdirSync(url);
            console.log("Sending Directory", files);
        }
    } else {
        res.setHeader("status", 404);
        res.end("Error 404(Not Found)");
    }
});

server.listen(3000, function () {
    console.log("listening on port 3000");
});
