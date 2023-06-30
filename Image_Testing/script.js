let img = loadImage("../kitten.jpg", function () {
    img.loadPixels();
    applyKernel([
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ]);
    //applyKernel([1]);
    //applyKernel(createSmoothing(9));
    img.updatePixels();
});
function createSmoothing(size) {
    let area = size ** 2;

    let array = new Array(area).fill(1 / area);
    console.log(array);
    return array;
}

function setUp() {
    createCanvas(img.width, img.height);
    frameRate(60);
}
function draw() {
    clear();
    image(img, 0, 0);
}
let res = 1;
function applyKernel(arr) {
    let size = arr.length ** 0.5;
    let offset = floor(size / 2);
    console.log(offset);
    for (var i = offset; i < img.width - offset; i += res) {
        for (var j = offset; j < img.height - offset; j += res) {
            let col = color(0);
            for (var x = -offset; x < size / 2; x++) {
                for (var y = -offset; y < size / 2; y++) {
                    let inda = ind(x, y, offset, size);
                    //console.log(arr[inda])
                    col = Rgb.add(col, Rgb.mults(img.pixels[img.index(i + x, j + y)], arr[inda]));
                    //console.log(col);
                }
            }
            img.pixels[img.index(i, j)] = col;
        }
    }
}
function ind(x, y, offset, size) {
    return offset + x + (y + offset) * size
}