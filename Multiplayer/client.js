class Player {
    constructor() {
        this.socket = io();
        let socket = this;
        this.socket.on("pos", function (pos) {
            socket.pos = pos;
        });
        console.log(this.socket);
        this.acc = new Vector2(1, 0);
        this.vel = new Vector2();
        this.pos = new Vector2();
        this.size = new Vector2(30, 60);
        on.keydown.bind(function (key) {
            if (key == " ") {
                socket.socket.emit("jump", new Vector2(0, -10));
            }
        });
    }
    init() {
        this.socket.emit("initial_data", [this.pos, this.size, [0, 0, CanvasWidth, CanvasHeight]]);
    }
    update() {
        this.socket.emit("velx", GetAxis('horizontal') * 5);
        this.socket.emit("update");


        rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}