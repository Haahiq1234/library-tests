/// <reference path="../Canvas.js"/>
/// <reference path="Point.js"/>

const WIDTH = 400;
const HEIGHT = 400;

const qt = new QuadTree(0, 0, WIDTH, HEIGHT);
const points = [];

for (let i = 0; i < 1000; i++) {
    let pt = new Point(Random.rangeInt(WIDTH), Random.rangeInt(HEIGHT), 3);
    points.push(pt);
    qt.insert(pt.x, pt.y, pt);
}

function setUp() {
    createCanvas(WIDTH, HEIGHT);
    frameRate(60);
    fill(0, 255, 0);
    //noStroke();
}
let i = 0;
function draw() {
    clear();
    qt.draw();
    fill(0, 255, 0);
    for (const p of points) {
        p.draw();
    }
    // if (i < points.length) {
    //     let pt = points[i];
    //     qt.insert(pt.x, pt.y, pt);
    //     i++;
    // }
    //qt.findSmallest(mouse.x, mouse.y);
    let arr = [];
    let circle = new CircleBoundary(mouse.x, mouse.y, 40);
    nofill();
    circle.draw();
    qt.addInCircle(circle, arr);
    fill(255, 0, 0);
    for (let pt of arr) {
        pt.data.draw();
    }
}
on.mousedown.bind(function (x, y) {
    let pt = new Point(x, y, 3);
    qt.insert(x, y, pt);
    points.push(pt);
});