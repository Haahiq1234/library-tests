/// <reference path='..\Canvas.js' />
var FramesPerSecond = 100;
let res = 80;
let grid;
let cellSize;
let colors;
function setUp() {
    createCanvas(400, 400, "white");
    frameRate(FramesPerSecond);
    cellSize = CanvasWidth / res;
    colors = {
        4: color(255, 0, 0),
        0: color(255, 255, 0),
        1: color(0, 185, 63),
        2: color(0, 104, 255),
        3: color(122, 0, 229)
    }
    grid = create2DArray(res, res, 0)
    setGrid(1);
    //console.table(grid);
    grid[res - 1][res - 1] = 2000;
    noStroke();
    grid[res / 2][res / 2] = 500;
    grid[0][0] = 2000;
    //Canvas.record(55000);
    //Canvas.setRecordingStartStop(key.enter, key.backSpace);
    //noLoop();
}
function setRow(row, no) {
    for (var i = 0; i < grid.length; i++) {
        grid[i][row] = no;
    }
}
function setGrid(no) {
    for (var i = 0; i < grid.length; i++) {
        grid[i] = new Array(res).fill(no);
    }
}
function setCol(col, no) {
    grid[col] = new Array(res).fill(no);
}
function create2DArray1(cols, rows, filll) {
    let arr = new Array(cols);
    for (var i = 0; i < cols; i++) {
        arr[i] = new Array(rows).fill(filll);
    }
    return arr;
}
function draw() {
    clear();
    render();
    topple();
}
function render() {
    for (var i = 0; i < res; i++) {
        for (var j = 0; j < res; j++) {
            var num = grid[i][j];
            if (num > 3)
                num = 4;
            fill(colors[num]);
            rect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}
function key_Down() {
    if (keyCode == key.backSpace) {
        noLoop();
    }
    if (keyCode == key.enter) {
        loop();
    }
    if (keyCode == key.space) {
        redraw();
    }
}
function topple() {
    var pile = create2DArray(res, res, 0);
    for (var i = 0; i < res; i++) {
        for (var j = 0; j < res; j++) {
            let num = grid[i][j];
            if (num < 4) {
                pile[i][j] += grid[i][j];
            } else {
                pile[i][j] += grid[i][j];
                if (i - 1 >= 0) {
                    pile[i - 1][j]++;
                    pile[i][j]--;
                }
                if (i + 1 < res) {
                    pile[i + 1][j]++;
                    pile[i][j]--;
                }
                if (j - 1 >= 0) {
                    pile[i][j - 1]++;
                    pile[i][j]--;
                }
                if (j + 1 < res) {
                    pile[i][j + 1]++;
                    pile[i][j]--;
                }
            }
        }
    }
    grid = pile;
}