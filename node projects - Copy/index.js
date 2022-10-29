class Server {
    constructor() {
        let app = require("express")();
        let http = require("http").Server(app);
        let io = require("socket.io")(http);
        console.log(__dirname);


        let sent = false;
        app.get('/', function (req, res) {
            console.log(req.path);
            if (!sent) {
                res.sendFile(__dirname + '/client/index.html');
                sent = true;
                return;
            }
            console.log(req.path);
            console.log(__dirname);
            res.sendFile(__dirname + req.path);
        });
        app.get('/js', function (req, res) {
            console.log(req.path + " js");
            //res.sendFile(__dirname + '/index.html');
        });
        io.on('connection', function (socket) {
            console.log('A user connected');

            //Whenever someone disconnects this piece of code executed
            socket.on('disconnect', function () {
                console.log('A user disconnected');
                sent = false;
            });
        });

        http.listen(3000, function () {
            console.log('listening on *:3000');
        });
    }
}
new Server();
