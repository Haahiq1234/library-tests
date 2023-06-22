const WIDTH = 300;
const HEIGHT = 600;
const grid = new Grid(10, 20);
var gradient;

function setUp() {
    createCanvas();
    frameRate(60);
    Camera2D.translate((CanvasWidth - WIDTH) / 2, (CanvasHeight - HEIGHT) / 2);
    gradient = new LinearGradient(0, CanvasHeight / 2, 0, CanvasHeight);
    //gradient = new RadialGradient(CanvasWidth / 2, CanvasHeight / 2, max(WIDTH, HEIGHT) / 2, CanvasWidth / 2, CanvasHeight / 2, max(CanvasWidth, CanvasHeight) / 2);
    gradient.add(0, "purple");
    gradient.add(1, "red");
    noStroke();
}
function draw() {
    backGround(gradient);
    fill(255);
    rect(0, 0, WIDTH, HEIGHT);
    grid.update();
}
