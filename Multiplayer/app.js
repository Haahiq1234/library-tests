const express = require('express');
const app = express();
const http = require('http');
const fs = require("fs");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const ServerApp = require("./ServerApp");

app.use(express.static(__dirname));

app.get("*Canvas.js", function (req, res) {
    res.end(fs.readFileSync(__dirname + "\\..\\Canvas.js"));
});


const serverApp = new ServerApp(io);

server.listen(3000, () => {
    console.log('listening on *:3000');
});