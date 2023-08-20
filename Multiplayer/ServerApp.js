class ServerApp {
    clients = {};
    constructor(socket) {
        this.socket = socket;
        let server = this;
        this.socket.on('connection', (socket) => {
            this.clients[socket.id] = new ClientData(socket);
            socket.on("disconnect", function () {
                server.clients[socket.id] = undefined;
            });
        });
    }
}
const gravity = { x: 0, y: 1 };
class ClientData {
    size;
    bounds;
    initialized = false;
    constructor(socket) {
        let clientData = this;
        this.pos = { x: 0, y: 0 };
        this.vel = { x: 0, y: 0 };
        this.socket = socket;
        this.socket.on("acc", function (acc) {
            clientData.accelerate(acc);
        });
        this.socket.on("velx", function (vx) {
            clientData.vel.x = vx;
        });
        this.socket.on("jump", function (strength) {
            clientData.vel = strength;
        });
        this.socket.on("update", function () {
            clientData.update();
        });
        this.socket.on("initial_data", function ([pos, size, bounds]) {
            clientData.pos = pos;
            clientData.size = size;
            clientData.bounds = bounds;
            console.log(bounds, size);
            clientData.initialized = true;
        });
    }
    accelerate(acc) {
        this.vel.x += acc.x;
        this.vel.y += acc.y;
    }
    close() {
        if (!this.initialized) return;
        if (this.pos.x < 0) {
            this.pos.x = 0;
            this.vel.x = 0;
        }
        if (this.pos.y < 0) {
            this.pos.y = 0;
            this.vel.y = 0;
        }
        if (this.pos.x > this.bounds[2] - this.size.x) {
            this.pos.x = this.bounds[2] - this.size.x;
            this.vel.x = 0;
        }
        if (this.pos.y > this.bounds[3] - this.size.y) {
            this.pos.y = this.bounds[3] - this.size.y;
            this.vel.y = 0;
        }
    }
    update() {
        if (!this.initialized) return;
        if (this.pos.y < this.bounds[3] - this.size.y - 5) {
            this.accelerate(gravity);
        }
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.close();
        this.socket.emit("pos", this.pos);

    }
}
module.exports = ServerApp;