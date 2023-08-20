class SimplePendulum {
    constructor(x, y, a, l) {
        this.p = new Vector2(x, y);
        this.d = new Vector2(0, 0);
        this.l = l;
        this.angle = a;
        this.angleV = 0;
        this.gravity = new Vector2(0, 0.4);
        this.down = this.gravity.heading();
        this.g = this.gravity.mag();
    }
    angleAcc() {
        return sin(this.angle) * (-this.g / this.l);
    }
    update() {
        this.angleV += this.angleAcc();
        this.angle += this.angleV;

        this.d.x = cos(this.angle + this.down) * this.l;
        this.d.y = sin(this.angle + this.down) * this.l;
    }
    draw() {
        circle(this.ax, this.ay, 5);
        line(this.ax, this.ay, this.bx, this.by);
        circle(this.bx, this.by, 10);
    }
    get ax() {
        return this.p.x;
    }
    get ay() {
        return this.p.y;
    }
    get dx() {
        return this.d.x;
    }
    get dy() {
        return this.d.y;
    }
    get bx() {
        return this.p.x + this.d.x;
    }
    get by() {
        return this.p.y + this.d.y;
    }
}
function tangent(v) {
    return new Vector2(-v.y, v.x);
}