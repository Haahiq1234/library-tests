const grid = new Grid(30, 30);
function setUp() {
    createCanvas(500, 500);
    frameRate(60);
    disableContextMenu();
    noStroke();
}
function draw() {
    clear();
    grid.update();
    grid.draw();
}