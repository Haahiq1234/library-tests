/// <reference path='../Canvas.js' />

const player = new Player();

function setUp() {
    createCanvas(400, 400);
    frameRate(60);
    player.init();
}
function draw() {
    clear();
    player.update();
}