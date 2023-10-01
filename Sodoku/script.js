/// <reference path='..\Canvas.js' />

const grid = new Grid(3, 3);

function setUp() {
    createCanvas(400, 400);
    frameRate(60);
    textSize(20);
}
function draw() {
    clear();
    grid.draw();
    if (Sketch.FRAME_NO % 5 == 0) {
        grid.collapseFirst();
    }
}