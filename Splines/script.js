Gizmo.DEFAULTRADIUS = 10;
const spline = new Spline();

let r = new Vector2(100, 100).mag();
let armLength = r * ((sqrt(2) - 1) * 50 / 51);

spline.addPoint(100, 100, -armLength, armLength);
spline.addPoint(300, 100, -armLength, -armLength);
spline.addPoint(300, 300, armLength, -armLength);
spline.addPoint(100, 300, armLength, armLength);
spline.addPoint(100, 100, -armLength, armLength);


var pressedMouse = false;

function setUp() {
    createCanvas(400, 400);
    frameRate(60);
    lineWidth(3);
}
function draw() {
    clear();
    spline.draw();
    //console.log(Mouse.timeSinceHeld);
}
function addPointOnMouse() {    
    let a = spline.addPoint(mouse.x, mouse.y, 0, 0).a;
    UI.Click(a);
}
on.pointerdown.bind(function(x, y) {
    if (GetKey(key.space)) {
        spline.addPoint(x, y);
    }
});