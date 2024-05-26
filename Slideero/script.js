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
    clear();
    game.update();
}
function lateDraw() {
    //console.log("After shit has been drawn");
    game.grid.draw_time();
}