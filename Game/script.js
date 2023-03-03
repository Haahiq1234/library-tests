const GRAVITY = 0.5;
const JUMPPOWER = 10;
const MOVEMENTSPEED = 7.5;
const STEPSIZE = 60;
const FOOTSPEED = 30;
const ANGLESPEED = 180 / STEPSIZE;
const DISTANCEBETWEENFEET = 50;

class Player {
    constructor(x, y) {
        this.pos = new Vector2(x, y);
        this.vel = new Vector2(0, 0);
        this.size = new Vector2(50, 100);
        this.grounded = false;
    }
    bounds() {
        return Shapes.bounds(this.pos, Vector.add(this.pos, this.size));
    }
    bindToScreen() {
        let bounds = this.bounds();
        if (bounds[0] < 0) {
            this.pos.x += (-bounds[0]);
            this.vel.x = 0;
        }
        if (bounds[1] < 0) {
            this.pos.y += (-bounds[1]);
            this.vel.y = 0;
        }
        if (bounds[2] > CanvasWidth) {
            this.pos.x += (CanvasWidth - bounds[2]);
            this.vel.x = 0;
        }
        if (bounds[3] > CanvasHeight) {
            this.pos.y += (CanvasHeight - bounds[3]);
            this.vel.y = 0;
            this.grounded = true;
        }
        if (bounds[3] < CanvasHeight) {
            this.grounded = false;
        }
    }
    update() {
        if (!this.grounded) {
            this.vel.y += GRAVITY;
        }
        this.vel.x = GetAxis("horizontal") * MOVEMENTSPEED;
        this.pos.add(this.vel);       

        this.bindToScreen();
    }
    jump() {
        //if (this.grounded)
            this.vel.y = -JUMPPOWER;
        this.grounded = false;
    }
    draw() {
        fill(255, 0, 0);
        rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}