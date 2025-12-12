/// <reference path='..\Canvas.js' />

const spiral_size = 5;
let cell_size;
let padding = 5;

function setUp() {
    createCanvas(400, 400);
    frameRate(60);
    cell_size = CanvasWidth / spiral_size;
    noLoop();
    clear();
    noStroke();
    backGround(200)
    for (let i = 0; i < spiral_size; i++) {
        for (let j = 0; j < spiral_size; j++) {
            get_spiral(i, j, spiral_size);
        }
    }
}
function draw() {
}


function spiral(i, j, n) {
    fill(0);
    let x = i * cell_size;
    let y = j * cell_size;
    let spiral = 0;
    if (i == j) {
        if (i < n / 2) {
            // top right corner, main diagonal min
            fill(255, 0, 0);
            spiral = 0;
            for (let k = 0; k < i; k++) {
                //console.log(n - 2 * (k) - 1);
                spiral += 4 * (n - 2 * (k) - 1);
            }
            spiral++;
        } else {
            // bottom left corner, main diagonal max
            spiral = 2 * (n - 1) + 1;
            for (let k = 0; k < (n - j - 1); k++) {
                //print(n - 2 * (k + 1));
                spiral += 4 * (n - 2 * (k + 1));
            }
            fill(0, 255, 0);
        }
    } else if ((i + j) == n - 1) {
        if (i < n / 2) {
            // bottom right, secondary diagonal x
            spiral = 3 * (n - 1) + 1;
            let w = n - 2;
            for (let k = 0; k < i; k++) {
                //console.log(w);
                spiral += 2 * (2 * w - 1);
                w -= 2;
            }
            fill(255, 255, 0)
        } else {
            // top left, secondary diagonal y
            spiral = n;
            let w = n - 1;
            for (let k = 0; k < j; k++) {
                //console.log(w);
                spiral += 2 * (2 * w - 1);
                w -= 2;
            }
            fill(0, 0, 255);
        }
    } else if (i < j) {
        if (i < (n - j - 1)) {
            fill(255, 0, 255);
        } else {
            fill(0, 255, 255);
        }
    } else if (j < i) {
        spiral = 0;
        if (i < (n - j - 1)) {
            spiral = i - j + 1;
            for (let k = 0; k < j; k++) {
                //console.log(n - 2 * (k) - 1);
                spiral += 4 * (n - 2 * (k) - 1);
            }
            fill(122, 0, 255);
        } else {
            spiral = 1 + j + i;
            let w = n - 1;
            for (let k = 0; k < (n - i - 1); k++) {
                //console.log(w);
                spiral += 2 * (2 * w - 1);
                w -= 2;
            }
            fill(0, 122, 255);
        }
    }
    rect(x + padding, y + padding, cell_size - padding * 2, cell_size - padding * 2);
    fill(0);
    text(spiral, x + cell_size / 2, y + cell_size / 2 - 10);
    text("(" + i + ", " + j + ")", x + cell_size / 2, y + cell_size / 2 + 10);
}

function get_spiral(i, j, n) {
    fill(0, 122, 255);
    let x = i * cell_size;
    let y = j * cell_size;
    //i = n - i - 1;
    //j = n - j - 1;
    let spiral = 1;
    let min_ij = min(i, j, n - i - 1, n - j - 1);
    for (let k = 0; k < min_ij; k++) {
        spiral += 4 * (n - 2 * k - 1);
    }
    let w = n - min_ij * 2 - 1;
    if (j <= i && (i + j) < (n - 1)) {
        fill(0, 122, 0);
        spiral += i - min_ij;
    } else if (i < j && i < (n - j)) {
        fill(255, 0, 0);
        spiral += 3 * w + (n - j - 1 - i);
    } else if (i <= j) {
        spiral += 2 * w + (j - i);
        fill(255, 122, 0);
    } else {
        spiral += w + j - (n - i - 1);
        fill(255, 0, 122);
    }
    //spiral = n * n - spiral + 1;
    //fill(150);
    rect(x + padding, y + padding, cell_size - padding * 2, cell_size - padding * 2);
    fill(0);
    text(spiral, x + cell_size / 2, y + cell_size / 2);
    //text("(" + i + ", " + j + ")", x + cell_size / 2, y + cell_size / 2 + 10);
}
function get_spiral_value(i, j, n) {
    i = n - i - 1;
    j = n - j - 1;
    let spiral = 1;
    let min_ij = min(i, j, n - i - 1, n - j - 1);
    for (let k = 0; k < min_ij; k++) {
        spiral += 4 * (n - 2 * k - 1);
    }
    let w = n - min_ij * 2 - 1;
    if (j <= i && (i + j) < (n - 1))
        spiral += i - min_ij;
    else if (i < j && i < (n - j))
        spiral += 3 * w + (n - j - 1 - i);
    else if (i <= j)
        spiral += 2 * w + (j - i);
    else
        spiral += w + j - (n - i - 1);
    return n * n - spiral + 1;
}