/// <reference path="Canvas.js"/>

class Physics2DMassPoint {
    constructor(x, y, m = 1) {
        this.pos = new Vector2(x, y);
        this.mass = m;
        this.vel = new Vector2(0, 0);

        this.acc = new Vector2(0, 0);

        this.bounce = 0;
        this.dampening = 0.98;
    }
    lock() {
        this.locked = true;
    }
    unlock() {
        this.locked = false;
    }
    update(dt) {
        if (!this.locked) {
            this.vel.x += this.acc.x * dt;
            this.vel.y += this.acc.y * dt;

            this.vel.mult(this.dampening);

            this.pos.x += this.vel.x * dt;
            this.pos.y += this.vel.y * dt;
        }
        //console.log(this.pos);
        this.acc.reset();
    }
    bindToBounds(bounds) {
        //console.log(this.pos);
        let pos = bounds.constraint(this.pos.x, this.pos.y);
        if (pos.x != this.pos.x) {
            this.vel.x *= this.bounce;
        }
        if (pos.y != this.pos.y) {
            this.vel.y *= this.bounce;
        }
        this.pos.set(pos.x, pos.y);
    }
    addForce(f) {
        this.acc.add(Vector.div(f, this.mass));
    }
}
class Physics2DSpring {
    constructor(a, b, k, kd, dist = Vector.dist(a.pos, b.pos)) {
        this.a = a;
        this.b = b;
        this.rest = dist;
        this.ks = k;
        this.kd = kd;
    }
    update() {
        let dir = Vector.sub(this.b.pos, this.a.pos);
        let dirLen = dir.mag();
        if (dirLen > 0) {
            let x = (dirLen - this.rest) * this.ks;
            dir.div(dirLen);
            let f = dir.mult(x + this.calculateDampening(dir));
            this.apply(f);
        }
    }
    apply(force) {
        this.a.addForce(force);
        this.b.addForce(force.mult(-1));
    }
    calculateDampening(normalizedPositionDifference) {
        let velocityDifference = Vector.sub(this.b.vel, this.a.vel);
        let fd = Vector.dot(normalizedPositionDifference, velocityDifference) * this.kd;
        return fd;
    }
}
class Physics2DSystem {
    constructor() {
        this.points = [];
        this.springs = [];
        this._gravity = [0, 0];
        this.bounds = [];
        this.timeDependent = true;
    }
    SetTimeDependency(bool) {
        this.timeDependent = bool;
    }
    dt() {
        return this.timeDependent ? (Time.deltaTime / 100) : 1;
    }
    update() {
        let dt = this.dt();
        for (var point of this.points) {
            point.acc.add(this._gravity(point.pos.x, point.pos.y));
            point.update(dt);
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
        if (typeof (gr) == "function") {
            this._gravity = gr;
        } else {
            this._gravity = (x, y) => gr;
        }
    }
}

class Bounds {
    constructor(x, y, w, h) {
        this.x = x + ((w < 0) ? w : 0);
        this.y = y + ((h < 0) ? h : 0);
        this.w = Math.abs(w);
        this.h = Math.abs(h);
    }
    contains(px, py) {
        return (px >= this.x && py >= this.y && px <= this.x + this.w && py <= this.y + this.h);
    }
    intersectsRect(rect) {
        return (this.x < rect.x + rect.w && this.x + this.w > rect.x && this.y < rect.y + rect.h && this.y + this.h > rect.h);
    }
    constraint(x, y) {
        return new Vector2(
            constraint(x, this.x, this.x + this.w),
            constraint(y, this.y, this.y + this.h)
        );
    }
}
const Rect = Bounds;