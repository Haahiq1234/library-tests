/// <reference path='..\Canvas.js' />

const grid = new Grid(20, 20);

function setUp() {
    createCanvas(400, 400);
    frameRate(60);

    grid.initialize();
    noStroke();
}
function draw() {
    clear();
    grid.update();
    grid.draw();
}