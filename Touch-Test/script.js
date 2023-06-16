const gizmo = new Gizmo(200, 200);

function setUp() {
    createCanvas(400, 400);
    frameRate(60);
}
function draw() {
    clear();
    if (mousePressed) {
        Camera2D.translate(Mouse.dx, Mouse.dy);
    }
}
on.wheel.bind(function(delta) {
    Camera2D.zoom(1.1 ** delta, mouse.x, mouse.y);
});
// on.pointerdown.bind(function(x, y, event) {
//     console.log(event);
//     //MobileDebug.Log("onpointerdown:", x, y);
//     fill(255, 0, 0);
//     circle(x, y, 5);
// });
// on.pointerup.bind(function(x, y, px, py, duration, event) {
//     console.log(event);
//     //MobileDebug.Log("onpointerup:", x, y);
//     line(px, py, x, y);
//     fill(0, 0, 255);
//     circle(x, y, 5);
// });
// on.pointermove.bind(function(event) {
//     //fill(0, 255, 0);
//     //circle(event.clientX, event.clientY, 5);
//     //MobileDebug.Log(event.clientX, event.clientY);
// });