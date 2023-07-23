const BACKGROUND_ALPHA = 220;


const grid = new Grid(5, 7);
var gradient;

function setUp() {
    createCanvas(innerWidth, innerHeight);
    frameRate(60);
    textSize(25);
    noStroke();

    gradient = new LinearGradient(0, CanvasHeight / 2, 0, CanvasHeight);
    gradient.add(0, color(128, 0, 128, BACKGROUND_ALPHA));
    gradient.add(1, color(255, 0, 0, BACKGROUND_ALPHA));

    Camera2D.translate(X, Y);
}
function draw() {
    backGround(gradient);
    grid.draw();
}