const test = new test1();

function setUp() {
    createCanvas(400, 400);
    frameRate(60);
    test.init();
}
function draw() {
    clear();
    test.update();
}