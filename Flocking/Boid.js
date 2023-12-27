const PERCEPTION_RADIUS = 25;
const circleToUse = new CircleBoundary(0, 0, 2 * PERCEPTION_RADIUS);


class Boid extends Vector2 {
    constructor(x, y) {
        super(x, y);
        this.vel = Vector.randomVelocity(1, 2);
        //this.vel.setMag(Random.range(1, 2));
        this.perceptionRadius = PERCEPTION_RADIUS;
        this.acc = new Vector2(0, 0);
        this.len = 6.6;
        this.maxSpeed = 3;
        this.angle = 0;
        this.maxForce = 0.1;
        this.circle = new CircleBoundary(x, y, this.perceptionRadius);
        this.tempData = 0;
        this.cur_dist = 0;
    }
    addForce(force) {
        this.acc.add(force);
    }
    pursue(pos) {
        let force = Vector.sub(pos, this).setMag(this.maxSpeed);
        force.sub(this.vel);
        //force.limit(this.maxForce);
        this.acc.add(force);
    }
    flock(qt) {
        let force = createVector();
        circleToUse.x = this.x;
        circleToUse.y = this.y;
        let flock = [];
        qt.addInCircle(circleToUse, flock);
        flock = flock.map(boid => { boid.data.cur_dist = boid.len; return boid.data; });

        force.add(this.align(flock));
        force.add(this.steer(flock));
        force.add(this.flee(flock));
        //force.limit(this.maxForce);
        this.addForce(force);
    }
    align(flock) {
        let total = 0;
        let force = createVector();
        for (let boid of flock) {
            //console.log(boid);
            //boid.tempData = Vector.dist(this, boid);
            boid.tempData = boid.cur_dist;
            let d = boid.tempData;
            if (boid != this && d < this.perceptionRadius) {
                force.add(boid.vel);
                total++;
            }
        }
        if (total > 0) {
            force.div(total);
        }
        force.limit(this.maxForce);
        return force;
    }
    flee(flock) {
        let total = 0;
        let pos = createVector();
        let force = createVector();
        for (let boid of flock) {
            let d = boid.tempData;
            if (boid != this && d < this.perceptionRadius / 1.25) {
                let diff = Vector.sub(this, boid);
                diff.div(d);
                pos.add(diff);
                total++;
            }
        }
        if (total > 0) {
            pos.div(total);
            force = pos.setMag(this.maxSpeed);
            force.sub(this.vel);
        }
        force.limit(this.maxForce);
        return force;
    }
    steer(flock) {
        let total = 0;
        let pos = createVector();
        let force = createVector();
        for (let boid of flock) {
            if (boid != this) {
                pos.add(boid);
                total++;
            }
        }
        if (total > 0) {
            pos.div(total);
            force = Vector.sub(pos, this).setMag(this.maxSpeed);
            force.sub(this.vel);
        }
        force.limit(this.maxForce);
        return force;
    }
    run(qt) {
        this.update();
        this.edges();
        this.show();
        this.flock(qt);
    }
    edges() {
        if (this.x > CanvasWidth + this.len / 2) {
            this.x = -this.len / 2;
        }
        if (this.x < -this.len / 2) {
            this.x = CanvasWidth + this.len / 2;
        }
        if (this.y > CanvasHeight + this.len / 2) {
            this.y = -this.len / 2;
        }
        if (this.y < -this.len / 2) {
            this.y = CanvasHeight + this.len / 2;
        }
    }
    update() {
        this.angle = this.vel.heading() ?? this.angle;
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.add(this.vel);
        this.acc.reset();
    }
    show() {
        translate(this.x, this.y);
        fill(255);
        rotate(this.angle);
        triangle(-this.len, this.len / 2, -this.len, -this.len / 2, this.len, 0);
        rotate(-this.angle);
        translate(-this.x, -this.y);
    }
}