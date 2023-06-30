class Particle {
    particles = [];
    destroyed = false;
    constructor(pos, size, vel, col, firework) {
        this.pos = pos;
        this.size = size;
        this.vel = vel;
        this.acc = Vector.zero.copy();
        this.col = Rgb.split(col);
        this.firework = firework;
    }
    update() {
        this.vel.add(Vector.mult(this.acc, Time.deltaTime / 16));
        this.pos.add(Vector.mult(this.vel, Time.deltaTime / 16));
        this.acc.set(0, 0);
    }
    draw() {
        fill(this.col, this.firework.span);
        noStroke();
        circle(this.pos.x, this.pos.y, this.size * (0.5 + 0.5 * this.firework.span / 255));
    }
    addForce(force) {
        this.acc.add(force);
    }
}