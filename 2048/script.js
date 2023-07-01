const grid = new Grid(4, 4);
function setUp() {
    if (IsMobile()) {
        createCanvas(innerWidth, innerWidth);
    } else {
        createCanvas(400, 400);
    }
    frameRate(60);

    console.log(grid);
    noLoop();
    let length = min(CanvasWidth, CanvasHeight) / 4;
    addSlideEvent(function (ax, ay, bx, by) {
        let dx = bx - ax;
        let dy = by - ay;
        if (abs(dx) > abs(dy)) {
            console.log("Horizontal move");
            if (dx > 0) {
                grid.operate(1, arr => arr.reverse());
            } else {
                grid.operate(1, arr => arr);
            }
        } else {
            console.log("Vertical move");
            if (dy < 0) {
                grid.operate(0, arr => arr);
            } else {
                grid.operate(0, arr => arr.reverse());
            }
        }
    }, length);
}
function draw() {
    clear();
    grid.draw();
}
on.keydown.bind(function () {
    if (keyCode == key.down) {
        grid.operate(0, arr => arr.reverse());
    } else if (keyCode == key.up) {
        grid.operate(0, arr => arr);
    } else if (keyCode == key.left) {
        grid.operate(1, (arr) => arr);
    } else if (keyCode == key.right) {
        grid.operate(1, arr => arr.reverse());
    }
});