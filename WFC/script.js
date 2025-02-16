/// <reference path='..\Canvas.js' />

const grid = new Grid(50, 50);


const SHOW_POSSIBLE_TILES = false;
const SEPARATE_RESOLVING = false;

on.keydown.bind(() => {
    if (keyCode == key.space) {
        //redraw()
        grid.update();
        //console.log("looped")
    }
    if (keyCode == key.enter) {
        if (Sketch.RUNNING) {
            noLoop();
        } else {
            loop();
        }
    }
});

function setUp() {
    createCanvas(400, 400);
    frameRate(60);
    //noLoop();
}
function draw() {
    clear();
    //console.log("ok")
    grid.update();
    grid.draw();
    //show_tile_data(floorDiv(Sketch.FRAME_NO, 60));
}
function show_tile_data(index) {
    let tile = tiles[index];
    let tile_size = 120;
    tile.draw(CanvasWidth / 2 - tile_size / 2, CanvasHeight / 2 - tile_size / 2, tile_size, tile_size)
    show_sides((CanvasWidth - tile_size) / 2, (CanvasHeight - tile_size) / 2 - tile_size, tile.options[TOP], tile_size);
    show_sides((CanvasWidth + tile_size) / 2, (CanvasHeight - tile_size) / 2, tile.options[RIGHT], tile_size);
    show_sides((CanvasWidth - tile_size) / 2, (CanvasHeight + tile_size) / 2, tile.options[BOTTOM], tile_size);
    show_sides((CanvasWidth - tile_size) / 2 - tile_size, (CanvasHeight - tile_size) / 2, tile.options[LEFT], tile_size);
}
function show_sides(x, y, tile_list, tile_size) {
    push()
    translate(x, y);
    let padd = 3;
    //console.log(tile_list)
    for (let k = 0; k < tile_list.length; k++) {
        //console.log(k);
        let tile = tiles[tile_list[k]];
        let i2 = k % NUM_TILES_X;
        let j2 = (k - i2) / NUM_TILES_X;
        tile.draw(
            (i2 / NUM_TILES_X) * tile_size + padd, (j2 / NUM_TILES_X) * tile_size + padd,
            tile_size / NUM_TILES_X - padd * 2, tile_size / NUM_TILES_X - padd * 2
        );
    }
    pop();
}