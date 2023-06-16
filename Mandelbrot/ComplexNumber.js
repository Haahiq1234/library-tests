const Complex = {
    mult: function ([a, b], [c, d]) {
        return [a * c - b * d, a * d + b * c];
    },
    square: function ([a, b]) {
        return [a ** 2 - b ** 2, 2 * a * b];
    },
    add: function ([a, b], [c, d]) {
        return [a + c, b + d];
    },
    abs: function ([a, b]) {
        return abs(a + b);
    }
}
const xoffset = -2;
const yoffset = -2;
const xscale = 4;
const yscale = 4;

const MAX_ITER = 100;

function getComplex(x, y) {
    x = x / CanvasWidth * xscale;
    y = y / CanvasHeight * yscale;
    //console.log(x, y);
    return [x + xoffset, y + yoffset];
}
function getColor(x, y) {
    let z = getComplex(x, y);
    let pz = [...z];
    let n = 0;
    while (n < MAX_ITER) {
        z = Complex.add(Complex.square(z), pz);
        if (Complex.abs(z) > 16) {
            break;
        }
        //console.log(z);
        n++;
    }
    let brightness = map(n, 0, MAX_ITER, 0, 255);
    //console.log(n);
    return color(brightness);
}