//AngleMode(RADIANS);
/// <reference path="../Canvas.js" />


const a = new SimplePendulum(80, 0, -30, 150);
const b = new DoublePendulum(200, 0, -20, 150, 20, -60, 150, 20);

function setUp() {
    createCanvas(400, 400);
    frameRate(60);
    Camera2D.enablePanning();
}
function draw() {
    clear();
    a.update();
    a.draw();
    b.update();
}