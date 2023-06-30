const GRAVITY = 0.25;
const MOVEMENTSPEED = 7.5;
const JUMP_POWER = -10;
const JUMP_TIME = -JUMP_POWER / GRAVITY;

class Player {
    constructor(x, y) {
        this.pos = new Vector2(x, y);
        this.vel = new Vector2(0, 0);
        this.size = new Vector2(50, 50);
        this.center = new Vector2(25, 25);
        this.angle = 0;
    }
    bounds() {
        return Shapes.bounds(this.pos, Vector.add(this.pos, this.size));
    }
    bindToScreen() {
        let bounds = this.bounds();
        if (bounds[0] < 0) {
            this.pos.x += (-bounds[0]);
            this.vel.x = 0;
            this.unanimate();
        }
        if (bounds[1] < 0) {
            this.pos.y += (-bounds[1]);
            this.vel.y = 0;
        }
        if (bounds[2] > CanvasWidth) {
            this.pos.x += (CanvasWidth - bounds[2]);
            this.vel.x = 0;
            this.unanimate();
        }
        if (bounds[3] > CanvasHeight) {
            this.pos.y += (CanvasHeight - bounds[3]);
            this.vel.y = 0;
            this.grounded = true;
        }
        if (bounds[3] < CanvasHeight) {
            //this.unanimate();
            this.grounded = false;
        }
    }
    update() {
        if (!this.grounded) {
            this.vel.y += GRAVITY;
        }
        let accx = GetAxis("horizontal") * MOVEMENTSPEED;
        if (accx == 0) {
            this.vel.x *= 0.6;
            if (abs(this.vel.x) < 1) {
                this.vel.x = 0;
            }
            //this.vel.x = 0;
        } else {
            this.vel.x = accx;
        }
        this.pos.add(this.vel);

        this.bindToScreen();
    }
    jump() {
        this.vel.y = JUMP_POWER;
        this.grounded = false;
        this.animate();
    }
    animate() {
        if (this.animation) {
            this.animation.cancel();
        }
        this.animation = new Animator([this, sign(this.vel.x)], JUMP_TIME, function (t) {
            if (this.data[0].vel.x != 0) {
                this.data[1] = sign(this.data[0].vel.x);
            }
            this.data[0].angle = 360 * t * this.data[1];
        }, function () { });
    }
    unanimate() {
        if (this.animation) {
            this.animation.cancel();
        }
        this.angle = 0;
    }
    draw() {
        fill(255, 0, 0);
        noStroke();
        translate(this.pos.x + this.center.x, this.pos.y + this.center.y);
        rotate(this.angle);
        rect(-this.center.x, -this.center.y, this.size.x, this.size.y);
        circle(-this.center.x, -this.center.y, 20);
    }
}