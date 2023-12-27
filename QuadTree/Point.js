///<reference path="../Canvas.js"/>

class Point {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
    draw() {
        noStroke();
        circle(this.x, this.y, this.r);
    }
}