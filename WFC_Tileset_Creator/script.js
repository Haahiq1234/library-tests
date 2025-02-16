/// <reference path='..\Canvas.js' />

const size = 4;
const padding = 7;
const pipe_end_padding = 3;
const second_padding = 3;
const curve = 5;

function setUp() {
    createCanvas(400, 400);
    let cell_size = CanvasWidth / size;
    let path_size = cell_size / 3;
    backGround(23, 23, 50);

    cell(cell_size * 0, cell_size * 0, cell_size, path_size, true, false, true, false);
    cell(cell_size * 1, cell_size * 0, cell_size, path_size, false, true, false, true);
    cell(cell_size * 2, cell_size * 0, cell_size, path_size, true, true, true, true);


    cell(cell_size * 0, cell_size * 1, cell_size, path_size, true, true, false, false);
    cell(cell_size * 1, cell_size * 1, cell_size, path_size, false, true, true, false);
    cell(cell_size * 2, cell_size * 1, cell_size, path_size, false, false, true, true);
    cell(cell_size * 3, cell_size * 1, cell_size, path_size, true, false, false, true);

    cell(cell_size * 0, cell_size * 2, cell_size, path_size, true, false, true, true);
    cell(cell_size * 1, cell_size * 2, cell_size, path_size, true, true, false, true);
    cell(cell_size * 2, cell_size * 2, cell_size, path_size, true, true, true, false);
    cell(cell_size * 3, cell_size * 2, cell_size, path_size, false, true, true, true);

    cell(cell_size * 0, cell_size * 3, cell_size, path_size, true, false, false, false);
    cell(cell_size * 1, cell_size * 3, cell_size, path_size, false, true, false, false);
    cell(cell_size * 2, cell_size * 3, cell_size, path_size, false, false, true, false);
    cell(cell_size * 3, cell_size * 3, cell_size, path_size, false, false, false, true);

    noLoop();
    //frameRate(60);
}
function cell(x, y, cell_size, path_size, top, right, bottom, left) {
    push();
    translate(x, y);
    fill(100);
    let pipe_width = 5;

    let joins = top + bottom + left + right;


    noStroke();
    if (top) {
        rect(
            path_size + padding,
            0,
            path_size - padding * 2,
            path_size + path_size / 2
        ) // top

    }
    if (right) {
        rect(
            2 * path_size - path_size / 2,
            path_size + padding,
            path_size + path_size / 2,
            path_size - padding * 2
        ) // right
    }
    if (bottom) {
        rect(
            path_size + padding,
            2 * path_size - path_size / 2,
            path_size - padding * 2,
            path_size + path_size / 2
        ) // bottom
    }
    if (left) {
        rect(
            0,
            path_size + padding,
            path_size + path_size / 2,
            path_size - padding * 2
        ) // left
    }

    squircle(
        path_size + padding, path_size + padding,
        path_size - padding * 2, path_size - padding * 2,
        curve
    );

    fill(50);
    if (top) {
        rect(
            path_size + padding + second_padding,
            0,
            path_size - padding * 2 - second_padding * 2,
            path_size + padding
        ) // top
    }
    if (right) {
        rect(
            2 * path_size - padding,
            path_size + padding + second_padding,
            path_size + padding,
            path_size - padding * 2 - second_padding * 2
        ) // right

    }
    if (bottom) {
        rect(
            path_size + padding + second_padding,
            2 * path_size - padding,
            path_size - padding * 2 - second_padding * 2,
            path_size + padding
        ) // bottom

    }
    if (left) {
        rect(
            0,
            path_size + padding + second_padding,
            path_size + padding,
            path_size - padding * 2 - second_padding * 2
        ) // left
    }
    squircle(
        path_size + padding + second_padding, path_size + padding + second_padding,
        path_size - (padding + second_padding) * 2, path_size - (padding + second_padding) * 2,
        curve
    );
    fill(75);
    if (top) {
        rect(
            path_size + pipe_end_padding, 0, path_size - pipe_end_padding * 2, pipe_width
        ) // top
    }
    if (right) {
        rect(
            cell_size - pipe_width, path_size + pipe_end_padding, pipe_width, path_size - pipe_end_padding * 2
        ) // right

    }
    if (bottom) {
        rect(
            path_size + pipe_end_padding, cell_size - pipe_width, path_size - pipe_end_padding * 2, pipe_width
        ) // bottom

    }
    if (left) {
        rect(
            0, path_size + pipe_end_padding, pipe_width, path_size - pipe_end_padding * 2
        ) // left
    }
    pop();

}
function draw() {
    //clear();
}