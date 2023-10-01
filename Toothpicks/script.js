/// <reference path='..\Canvas.js' />

var FramesPerSecond = 50;
var button;
var len = 50;
var minX;
var maxX;
var picks = [];

// const butt = new Button(250, 400, 70, 40);
// butt.text("Next", 20);
// butt.bind("click", next);
// butt.setColor(color(0, 255, 0));

function setUp() {
    createCanvas(500, 500, "white");
    picks.push(new Toothpick(0, 0, -1));
    frameRate(FramesPerSecond);
    minX = CanvasWidth / -2;
    maxX = CanvasWidth / 2;
    Canvas.startRecording();
    Canvas.setRecordingStop(key.space, "toothpicks");
}
function next() {
    var next = [];
    for (var i in picks) {
        if (picks[i].newPick) {
            let nextA = picks[i].checkA(picks);
            let nextB = picks[i].checkB(picks);
            if (nextA != null) {
                next.push(nextA);
            }
            if (nextB != null) {
                next.push(nextB);
            }
            picks[i].newPick = false;
        }
    }
    picks = picks.concat(next);
    //redraw();
    //Canvas.recordFrame();
}
function draw() {
    clear();
    backGround(255);
    if (Sketch.FRAME_NO % 10 == 0) {
        next();
    }
    let factor = CanvasWidth / (maxX - minX);
    translate((CanvasWidth / 2), (CanvasHeight / 2));
    for (var i in picks) {
        picks[i].show(factor * 0.9);
        minX = min(picks[i].ax, minX);
        maxX = max(picks[i].ax, maxX);
    }
}
function lateDraw() {
    // noStroke();
    // fill(100, 100);
    // circle(Mouse.x, Mouse.y, 10 - 5 * (+mousePressed));
}
function mouse_Click() {
    redraw();
}