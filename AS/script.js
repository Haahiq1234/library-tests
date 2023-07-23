const grid = new Grid(40, 40);
function setUp() {
    createCanvas(400, 400);
    frameRate(60);
}
function draw() {
    clear();
    grid.draw();
}