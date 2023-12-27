let res = 1;
const system = new CameraSystem();

function setUp() {
    createCanvas(400, 400);
    frameRate(20);
    noStroke();
}
function draw() {
    clear();
    system.update();
    loadPixels();
    for (var x = 0; x < CanvasWidth; x += res) {
        for (var y = 0; y < CanvasHeight; y += res) {
            let pos = system.convert(x, y);
            let index = 4 * (x + y * CanvasHeight)
            //console.log(x, y, cx, cy);

            let z = getColor(pos.x, pos.y);
            //fill(z);
            //rect(x, y, res, res);


            pixels[index] = z[0];
            pixels[index + 1] = z[1];
            pixels[index + 2] = z[2];
            pixels[index + 3] = 255;
        }
    }
    updatePixels();
}