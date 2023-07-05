const grid = new Grid(2, 2, loadImage("../kitten.jpg"));
const game = new Game();

function setUp() {
    if (IsMobile()) {
        createCanvas(window.innerWidth, window.innerWidth);
    } else {
        createCanvas(400, 400);
    }
    frameRate(60);
    noStroke();
}
function draw() {
    backGround(189, 177, 165);
    grid.draw();
}