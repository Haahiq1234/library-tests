const turtle = new Turtle();

function setUp() {
    createCanvas(400, 400);
    frameRate(60);
    //turtle.moveTo();
}
function draw() {
    // /lear();
    turtle.move(5);
    turtle.jump(2);
    turtle.rotate(-5);
}