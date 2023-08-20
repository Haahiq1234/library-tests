/// <reference path='../Canvas.js' />

const branch = new Branch(80, -90, 15, 5);
let queue = [];
let time = 0;

function setUp() {
    createCanvas(400, 400);
    fill(0, 255, 0);
    stroke(66, 40, 14);
    branch.a = new Vector2(CanvasWidth / 2, CanvasHeight);
    time = new Date();
}
let times = {};
function draw() {
    clear();
    //console.log(Time.deltaTime);

    let ntime = new Date();
    let dt = ntime - time;
    if (!times[dt]) {
        times[dt] = 0;
    }
    times[dt]++;
    // if (dt > 20) {
    //console.log(dt);
    // }

    time = ntime;
    queue = [];
    branch.update();
    noStroke();
    for (var p of queue) {
        circle(p.x, p.y, 10);
    }
    stroke(66, 40, 14);
}