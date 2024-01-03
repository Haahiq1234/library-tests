/// <reference path='..\Canvas.js' />
/// <reference path='..\TextBox/script.js' />



let y = 0;

const PAGE_HEIGHT = 500;
const PAGE_WIDTH = 500 * Math.sqrt(2);
const HALF_WIDTH = PAGE_WIDTH / 2;

let size = 10;
{
    let mod_size = HALF_WIDTH / size;
    size = HALF_WIDTH / floor(mod_size);
}
const linesPerFrame = 5;

let grd;
function setUp() {
    createCanvas(PAGE_WIDTH, PAGE_HEIGHT);
    frameRate(60);
    lineWidth(4);
    textAlign(TEXT.CENTER, TEXT.MIDDLE);


    grd = new LinearGradient(0, 0, 0, CanvasHeight);
    grd.add(0, 100);
    grd.add(1, 0);
}
function draw() {
    //clear();
    //textFont("DISDAFONT");
    //textFont("Atari");
    //stroke(grd);
    for (let i = 0; i < linesPerFrame; i++) {
        for (let x = 0; x < CanvasWidth; x += size) {
            if (Random.range(1) < 0.5) {
                line(x, y, x + size, y + size);
            } else {
                line(x, y + size, x + size, y);
            }
        }
        y += size;
        if (y >= CanvasHeight) {
            noLoop();
            drawFinishes();
        }
    }
}
function drawFinishes() {
    let textWidth = HALF_WIDTH / 1.25;
    noStroke();
    fill(255);
    rct(300, 250, 125);
    fill(0);
    noStroke();
    // textSize(50);
    // text("HAPPY", CanvasWidth * 0.75, 200);
    // textSize(40);
    // text("WEDDING", CanvasWidth * 0.75, 250);
    // textSize(37);
    // text("ANNIVERSARY", CanvasWidth * 0.75, 300);
    //draw_Text("HAPPY", HALF_WIDTH + (HALF_WIDTH - textWidth) / 2, 50, textWidth, 50);
    //draw_Text("WEDDING", HALF_WIDTH + (HALF_WIDTH - textWidth) / 2, 150, textWidth, 50);
    //draw_Text("ANNIVERSARY", HALF_WIDTH + (HALF_WIDTH - textWidth) / 2, 250, textWidth, 50);
    //line(HALF_WIDTH, 0, HALF_WIDTH, CanvasHeight);
}
function rct(width, height, y) {
    squircle(HALF_WIDTH + (HALF_WIDTH - width) / 2, y, width, height, 50);
}