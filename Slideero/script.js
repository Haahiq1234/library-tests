const grid = new Grid(6, 6, /*loadImage("../Diamond_Ore.png")*/);
const menu = new Menu();

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
    clear();
    grid.draw();
}