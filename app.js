const express = require('express');
const http = require('http');

const server = http.createServer();
const app = express(server);

app.get('/', (req, res) => {
    //res.setHeader('Content-Type', 200);
    console.log(res);
    res.send("Hello");
});

server.listen(3000, () => {
    console.log("Listening on port 3000")
});