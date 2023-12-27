const colorHandler = new ColorHandler();

function setUp() {
    createCanvas(400, 400);
    frameRate(60);
    colorHandler.init();
}
function draw() {
    clear();
    colorHandler.update();
}