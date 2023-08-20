/// <reference path='../Canvas.js' />
const GROWTH_RATE = 2;
const LENGTH_DECREASE = 0.7;
const THICKNESS_DECREASE = 0.8;
const ANGLE_OFFSET = 30;


class Branch {
    parent;
    constructor(max_length, angle, thickness, n, parent) {
        this.n = n;
        this.length = 0;
        this.max_length = max_length;
        this.thickness = thickness;
        this.angle = angle;
        this.grown = false;
        this.children = [];
        this.parent = parent;
        if (this.parent) {
            this.a = this.parent.b;
        }
    }
    bloom() {
        if (this.n >= 0) {
            this.children.push(new Branch(this.length * LENGTH_DECREASE, this.angle + ANGLE_OFFSET, this.thickness * THICKNESS_DECREASE, this.n - 1, this));
            this.children.push(new Branch(this.length * LENGTH_DECREASE, this.angle - ANGLE_OFFSET, this.thickness * THICKNESS_DECREASE, this.n - 1, this));
        }
    }
    update() {
        if (this.b) {
            lineWidth(this.thickness);
            line(this.a.x, this.a.y, this.b.x, this.b.y);
        }
        if (this.length < this.max_length) {
            this.length += GROWTH_RATE;
            this.b = Vector.add(this.a, Vector.AngleToVector(this.angle, this.length));
        } else if (!this.grown) {
            this.bloom();
            this.grown = true;
        } else if (this.children.length > 0) {
            for (var child of this.children) {
                child.update();
            }
        } else {
            noLoop();
        }
        if (this.grown && this.n < 4) {
            queue.push(this.b);
        }
    }
}