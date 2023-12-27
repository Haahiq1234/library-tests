///<reference path="../Canvas.js"/>

const MAX_POINTS_IN_TREE = 8;

class RectBoundary {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    draw() {
        rect(this.x, this.y, this.w, this.h);
    }
    contains(x, y) {
        return x >= this.x && y >= this.y && x < (this.x + this.w) && y < (this.y + this.h);
    }
    intersectsRect(other) {
        return (
            this.x < other.x + other.w && this.x + this.w > other.x &&
            this.y < other.y + other.h && this.y + this.h > other.y
        );
    }
    intersectsCircle(other) {
        let x = constraint(other.x, this.x, this.x + this.w);
        let y = constraint(other.y, this.y, this.y + this.h);
        return other.contains(x, y);
    }
}
class CircleBoundary {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
    draw() {
        circle(this.x, this.y, this.r);
    }
    contains(x_or_pt, y) {
        if (y != undefined) {
            return ((this.x - x_or_pt) ** 2 + (this.y - y) ** 2) ** 0.5 <= this.r;
        }
        //console.log(x_or_pt);
        let len = ((this.x - x_or_pt.x) ** 2 + (this.y - x_or_pt.y) ** 2) ** 0.5;
        x_or_pt.len = len;
        return len <= this.r;
    }
}
class QuadTreePoint {
    len = 0;
    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        this.data = data;
    }
}

class QuadTree {
    topLeft;
    topRight;
    bottomLeft;
    bottomRight;
    constructor(x, y, w, h) {
        this.rect = new RectBoundary(x, y, w, h);
        this.points = [];
        this.branched = false;
    }
    draw() {
        nofill();
        rect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        if (this.branched) {
            this.topLeft.draw();
            this.topRight.draw();
            this.bottomLeft.draw();
            this.bottomRight.draw();
        }
    }
    insert(x, y, pt) {
        if (!this.rect.contains(x, y)) return;
        if (this.points.length < MAX_POINTS_IN_TREE) {
            this.points.push(new QuadTreePoint(x, y, pt));
        } else {
            if (!this.branched) {
                this.branch();
            }
            this.topLeft.insert(x, y, pt);
            this.topRight.insert(x, y, pt);
            this.bottomLeft.insert(x, y, pt);
            this.bottomRight.insert(x, y, pt);

        }
    }
    findSmallest(x, y) {
        if (this.rect.contains(x, y)) {
            if (!this.branched) {
                nofill();
                stroke(255, 0, 0);
                this.rect.draw();
                stroke(0);
            } else {
                this.topLeft.findSmallest(x, y);
                this.topRight.findSmallest(x, y);
                this.bottomLeft.findSmallest(x, y);
                this.bottomRight.findSmallest(x, y);
            }
        }
    }
    branch() {
        if (this.branched) return;
        this.branched = true;
        this.topLeft = new QuadTree(this.rect.x, this.rect.y, this.rect.w / 2, this.rect.h / 2);
        this.topRight = new QuadTree(this.rect.x + this.rect.w / 2, this.rect.y, this.rect.w / 2, this.rect.h / 2);
        this.bottomLeft = new QuadTree(this.rect.x, this.rect.y + this.rect.h / 2, this.rect.w / 2, this.rect.h / 2);
        this.bottomRight = new QuadTree(this.rect.x + this.rect.w / 2, this.rect.y + this.rect.h / 2, this.rect.w / 2, this.rect.h / 2);
    }
    addInCircle(circle, arr) {
        if (this.rect.intersectsCircle(circle)) {
            for (let pt of this.points) {
                if (circle.contains(pt)) {
                    arr.push(pt);
                }
            }
            if (this.branched) {
                this.topLeft.addInCircle(circle, arr);
                this.topRight.addInCircle(circle, arr);
                this.bottomLeft.addInCircle(circle, arr);
                this.bottomRight.addInCircle(circle, arr);
            }
        }
    }
}