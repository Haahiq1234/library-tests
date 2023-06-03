function setUp() {
    createCanvas(400, 400);
    frameRate(60);
}
function draw() {
    clear();
}
on.mouseup.bind(function(x, y, dx, dy) {
    noLoop();
    MobileDebug.Log(x, y, dx, dy);
    line(x, y, x - dx, y - dy);
});