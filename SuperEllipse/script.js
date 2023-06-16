const inc = 1;
const a_slider = new Slider();
const b = 100;
const n = 4;

function setUp() {
    createCanvas(400, 400);
    frameRate(60);
    nofill();
    Camera2D.translate(CanvasWidth / 2, CanvasHeight / 2);
}
function draw() {
    clear();
    beginShape();
    var na = 2 / n;

    for (var angle = 0; angle < 360; angle += inc) {
        let ca = cos(angle);
        let sa = sin(angle);
        let x = pow(abs(ca), na) * a * sign(ca);
        let y = pow(abs(sa), na) * b * sign(sa);
        vertex(x, y);
    }
    endShape();
}