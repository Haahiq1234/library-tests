Gizmo.DEFAULTRADIUS = 7.5;
const spline = new Spline();

spline.addPoint(100, 100);
spline.addPoint(200, 100);
spline.addPoint(300, 100);

function setUp() {
    createCanvas(400, 400);
    frameRate(60);
    lineWidth(3);
}
function draw() {
    clear();
    //curve.draw();
    spline.draw();
}

function key_Press() {
    if (keyCode == key.space) {
        spline.addPoint(mouse.x, mouse.y);
    }
}