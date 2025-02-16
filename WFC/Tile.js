const TOP = 0;
const RIGHT = 1;
const BOTTOM = 2;
const LEFT = 3;

const ROTATION_DATA = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1]
]

class Tile {
    index;
    sides;
    constructor(i, j, sides) {
        this.index = "Ur mom";
        this.i = i;
        this.j = j;
        this.sides = sides;
        this.rot = 0;
        this.options = [[], [], [], []];
    }
    draw(ox, oy, cw, ch) {
        let x = ox + (ROTATION_DATA[this.rot][0]) * cw;
        let y = oy + (ROTATION_DATA[this.rot][1]) * ch;
        translate(x, y);
        rotate(90 * this.rot);
        image(
            tileImage,
            this.i * tile_width, this.j * tile_height, tile_width, tile_height,
            0, 0, cw, ch
        );
        rotate(-90 * this.rot);
        translate(-x, -y);
    }
    rotate() {
        let sides = [];
        for (let i = 0; i < this.sides.length; i++) {
            sides.push(this.sides[(i - 1 + 4) % 4]);
        }
        let tile = new Tile(this.i, this.j, sides);
        tile.rot = this.rot + 1;
        return tile;
    }
    calculateOptions(tiles) {
        for (let i = 0; i < NUM_TILES; i++) {
            let other = tiles[i];
            if (check_edge(this.sides[TOP], other.sides[BOTTOM])) {
                this.options[TOP].push(i);
            }
            if (check_edge(this.sides[RIGHT], other.sides[LEFT])) {
                this.options[RIGHT].push(i);
            }
            if (check_edge(this.sides[BOTTOM], other.sides[TOP])) {
                this.options[BOTTOM].push(i);
            }
            if (check_edge(this.sides[LEFT], other.sides[RIGHT])) {
                this.options[LEFT].push(i);
            }
        }
    }
}
function check_edge(a, b) {
    let a_len = a.length;
    for (let i = 0; i < a_len; i++) {
        if (a[i] != b[a_len - i - 1]) return false;
    }
    return true;
}


let tile_set = loadCircuitCodingTrainTileSet();
//let tile_set = loadPipeTileSet();
console.log(tile_set);

const tiles = tile_set[0];
const tileImage = tile_set[1];
const tile_width = tile_set[2], tile_height = tile_set[3];
const NUM_TILES = tile_set[4];
const NUM_TILES_X = ciel(NUM_TILES ** 0.5);

for (let i = 0; i < tiles.length; i++) {

    tiles[i].calculateOptions(tiles);
}
console.log(tiles);