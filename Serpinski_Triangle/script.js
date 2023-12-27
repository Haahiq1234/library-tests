/// <reference path='..\Canvas.js' />

const N = 8;
// /const signOfSide = 
let bigLen = 2;
const offset = 50;

function setUp() {
    createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
    frameRate(60);
    //bigLen = (CanvasWidth - offset * 2) / (3 ** (N - 2.9));
    //bigLen = (CanvasWidth - offset * 2) / (1.5 * (2 ** (N)));
    translate(offset, CanvasHeight - offset);
    A(bigLen);
    noLoop();
}

let currentAngle = 0;
const signOfAngle = (N % 2 == 0) ? 1 : -1;
function rot(sn) {
    const ang = sn * 60 * signOfAngle;
    rotate(ang);
    currentAngle += ang;
}
function A(len, n = N) {
    if (n > 0) {
        B(len, n - 1);
        rot(1);
        A(len, n - 1);
        rot(1);
        B(len, n - 1);
    } else {
        line(0, 0, len, 0);
        translate(len, 0);
    }
}
function B(len, n = N) {
    if (n > 0) {
        A(len, n - 1);
        rot(-1);
        B(len, n - 1);
        rot(-1);
        A(len, n - 1);
    } else {
        line(0, 0, len, 0);
        translate(len, 0);
    }
}