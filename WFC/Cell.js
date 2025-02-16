let original_tile_set = [];
for (let i = 0; i < NUM_TILES; i++) {
    original_tile_set.push(i);
}
class Cell {
    constructor(i, j) {
        this.collapsed = false;
        this.tile = undefined;
        this.i = i;
        this.j = j;
        this.options = original_tile_set.slice();
    }

}