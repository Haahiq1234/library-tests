const grid = new Grid(4, 4);
function setUp() {
    createCanvas(400, 400);
    frameRate(60);

    console.log(grid);
}
function draw() {
    clear();
    grid.draw();
}
function key_Down() {
    if (keyCode == key.down) {
        grid.swipeDown();
    } else if (keyCode == key.up) {
        grid.swipeUp();
    } else if (keyCode == key.left) {
        grid.swipeLeft();
    } else if (keyCode == key.right) {
        grid.swipeRight();
    }
}