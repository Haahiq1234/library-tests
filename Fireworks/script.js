/// <reference path='..\Canvas.js' />

const fireworks = [];
const FIREWORK_CHANCE = 10;
const gravity = new Vector2(0, 0.2);


function setUp() {
    createCanvas(500, 500);
    fireworks.push(new Firework());
    textSize(min(CanvasWidth / 2, CanvasHeight) / 4);
    textFont("Verdana");
}
addSentenceCommand("p", function () { downloadCanvasImage() });
function draw() {
    backGround(255, 70);
    fill(207, 181, 59);
    for (let i = 0; i < fireworks.length; i++) {
        fireworks[i].update();
        if (fireworks[i].done()) {
            fireworks.splice(i, 1);
            i--;
        }
    }
    if (Random.range(100) < FIREWORK_CHANCE) {
        fireworks.push(new Firework());
    }
}
on.keydown.bind(function (keyCode) {
    if (keyCode == key.backSpace) {
        noLoop();
    } else if (keyCode == key.space) {
        redraw();
    } else if (keyCode == key.enter) {
        loop();
    }
});