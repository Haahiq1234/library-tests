const fireworks = [];
const FIREWORK_CHANCE = 5;
const gravity = new Vector2(0, 0.2);


function setUp() {
    createCanvas();
    fireworks.push(new Firework());
    textSize(min(CanvasWidth / 2, CanvasHeight) / 4);
    textFont("Verdana");
}
function draw() {
    backGround(1, 50, 32, 100);
    fill(207, 181, 59);
    //text("Eid", CanvasWidth / 2, CanvasHeight * 2.5 / 5);
    //text("Mubarak", CanvasWidth / 2, CanvasHeight / 5 * 3.5);

    text("Eid", CanvasWidth / 2, CanvasHeight / 2 - Canvas.textFontSize / 2);
    text("Mubarak", CanvasWidth / 2, CanvasHeight / 2 + Canvas.textFontSize / 2);
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