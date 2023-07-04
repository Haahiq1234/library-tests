class Physics2DMassPoint {
    constructor(x, y, m=1) {
        this.pos = new Vector2(x, y);
        this.mass = m;
        this.vel = new Vector2(0, 0);

        this.acc = new Vector2(0, 0);

        this.bounce = 0;
        this.dampening = 0.99;
    }
    update() {
        this.vel.add(Vector.mult(this.acc, Time.deltaTime / 100));
        this.pos.add(Vector.mult(this.vel, Time.deltaTime / 100));
        //console.log(this.pos);
        this.acc.reset();
    }
    bindToBounds(bounds) {
        //console.log(this.pos);
        if (this.pos.x < bounds.x) {
            this.pos.x = bounds.x;
            this.vel.x *= this.bounce;
        } 
        if (this.pos.y < bounds.y) {
            this.pos.y = bounds.y;
            this.vel.y *= this.bounce;
        }
        if (this.pos.x > (bounds.x + bounds.w)) {
            this.pos.x = bounds.x + bounds.w;
            this.vel.x *= this.bounce;
        }
        if (this.pos.y > (bounds.y + bounds.h)) {
            this.pos.y = bounds.y + bounds.h;
            this.vel.y *= this.bounce;
        }
    }
    addForce(f) {
        this.acc.add(Vector.div(f, this.mass));
    }
}
class Physics2DSpring {
    constructor(a, b, k, kd) {
        this.a = a;
        this.b = b;
        this.rest = Vector.dist(a.pos, b.pos);
        this.ks = k;
        this.kd = kd;
    }
    update() {
        let dir = Vector.sub(this.b.pos, this.a.pos);
        if (dir.mag() > 0) {
            let x = ((dir.mag() - this.rest) * this.ks);
            let f = dir.setMag(x + this.calculateDampening());
            this.apply(f);
        }
    }
    apply(force) {
        this.a.addForce(force);
        this.b.addForce(force.mult(-1));
    }
    calculateDampening() {
        let normalizedDirectionVector = Vector.directionVector(this.a.pos, this.b.pos);
        let velocityDifference = Vector.sub(this.b.vel, this.a.vel);
        let fd = Vector.dot(normalizedDirectionVector, velocityDifference) * this.kd;
        return fd;
    }
}
class Physics2DSystem {
    constructor() {
        this.points = [];
        this.springs = [];
        this._gravity = [0, 0];
        this.bounds = [];
    }
    update() {
        for (var point of this.points) {
            point.acc.add(this._gravity(point.pos.x, point.pos.y));
            point.update();
            for (var bounds of this.bounds) {
                point.bindToBounds(bounds);
            }
        }
        for (var spring of this.springs) {
            spring.update();
        }
    }
    addBounds(bound) {
        this.bounds.push(bound);
    }
    addPoint(p) {
        this.points.push(p);
    }
    addSpring(s) {
        this.springs.push(s);
    }
    set gravity(gr) {
        if (typeof(gr) == "function") {
            this._gravity = gr;
        } else {
            this._gravity = (x, y) => gr;
        }
    }
}