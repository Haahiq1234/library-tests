const snake = new Snake(0, 0, color(255, 0, 0), color(0, 0, 255));

function setUp() {
    if (IsMobile()) {
        createCanvas(innerWidth, innerWidth);
    } else {
        createCanvas(400, 400);
    }
    frameRate(60);
    noStroke();
}
function draw() {
    clear();
    snake.update();
    snake.draw();
}