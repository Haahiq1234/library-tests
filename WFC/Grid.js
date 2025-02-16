class Grid extends Array2D {
    constructor(width, height) {
        super(width, height);
        this.setEach(function (i, j, ind) {
            return new Cell(i, j);
        });
        let grid = this;
        on.start.bind(() => grid.start())
        this.current = [];
        this.previous = [];

        //this.collapse_tile(0, 0);
    }
    start() {
        this.cell_width = CanvasWidth / this.width;
        this.cell_height = CanvasHeight / this.height;
        //this.collapse_tile(0, 0);
        console.log(this.array);
        // for (let i = 0; i < this.width; i++) {
        //     this.remove_options(tiles[1].options[BOTTOM], this.array[i], -1);
        //     this.remove_options(tiles[1].options[TOP], this.array[i + this.length - this.width], -1);
        // }
        // for (let j = 0; j < this.height; j++) {
        //     this.remove_options(tiles[0].options[RIGHT], this.array[j * this.width], -1);
        //     this.remove_options(tiles[0].options[LEFT], this.array[(j + 1) * this.width - 1], -1);
        // }
    }
    collapse_tile(i, j, optional_tile = -1) {
        //console.log(i, j);
        let index = i + j * this.width;
        let cell = this.array[index];
        if (cell.collapsed) return;
        //console.log(cell);
        if (cell.options.length == 0) {
            console.error("NO OPTION REMAINING!!!");
            noLoop();
            return;
        }
        if (optional_tile != -1) {
            cell.tile = optional_tile;
        } else {
            cell.tile = Random.element(cell.options);
        }
        cell.collapsed = true;
        cell.options = [];
        this.add_to_check(this.previous, i, j, index, i + j * this.width);
        //noLoop();
        //redraw();
        //loop();
    }
    add_to_check(arr, i, j, index, p_index) {
        if (i > 0 && (index - 1) != p_index) {
            arr.unshift([index, LEFT, index - 1]);
        }
        if (j > 0 && (index - this.width) != p_index) {
            arr.unshift([index, TOP, index - this.width]);
        }
        if (i < (this.width - 1) && (index + 1) != p_index) {
            arr.unshift([index, RIGHT, index + 1]);
        }
        if (j < (this.height - 1) && (index + this.width) != p_index) {
            arr.unshift([index, BOTTOM, index + this.width]);
        }
    }
    resolve_options() {
        while (this.previous.length > 0) {
            let to_test = this.previous.pop();
            //console.log(to_test)
            let side = to_test[1];
            let current_index = to_test[2];
            //console.log(current_index);
            let current = this.array[current_index];
            if (current.collapsed) continue;

            let previous_cell = this.array[to_test[0]];
            if (previous_cell.collapsed) {
                let previous_tile = tiles[previous_cell.tile];
                this.remove_options(previous_tile.options[side], current, to_test[0]);
            } else {
                let possible = new Set();

                for (let i = 0; i < previous_cell.options.length; i++) {
                    let tile = tiles[previous_cell.options[i]];
                    for (let j = 0; j < tile.options[side].length; j++) {
                        possible.add(tile.options[side][j]);
                    }
                }
                this.remove_options([...possible], current, to_test[0]);
            }
        }
        this.previous = this.current;
        this.current = [];
    }
    update() {
        if (SEPARATE_RESOLVING) {
            this.resolve_options();
        } else {
            while (this.previous.length > 0) {
                this.resolve_options();
            }
        }
        //console.log(this.previous);
        if (this.previous.length == 0) {
            let smallest = [];
            let smallest_len = Infinity;
            for (let i = 0; i < this.length; i++) {
                if (!this.array[i].collapsed) {
                    let current_len = this.array[i].options.length
                    if (current_len < smallest_len) {
                        smallest = [i];
                        smallest_len = current_len;
                    } else if (current_len == smallest_len) {
                        smallest.push(i);
                    }
                }
            }
            if (smallest.length > 0) {
                let elem = Random.element(smallest);
                //console.log(elem);
                this.collapse_tile(elem % this.width, floorDiv(elem, this.width));
            } else {
                console.log("Grid has been collapsed");
                noLoop();
            }
        }
    }
    remove_options(possible, current, previous_index) {
        //newest problem: The cell first removes one half of them, and then the other half of the options
        let len = current.options.length;
        for (let i = 0; i < current.options.length; i++) {
            if (!possible.some((x) => x == current.options[i])) {
                current.options.splice(i, 1);
                i--;
            }
        }// The cell has not collapsed, hence tile is not set, hence the zero while showing the tile as it is the default value.

        if (len != current.options.length) {
            this.add_to_check(this.current, current.i, current.j, current.i + current.j * this.width, previous_index);
        }
    }
    draw() {
        let padd = 1;
        this.forEach((i, j, cell, index) => {
            if (cell.collapsed) {
                let tile = tiles[cell.tile];
                //console.log(tile, cell)
                tile.draw(i * this.cell_width, j * this.cell_height, this.cell_width, this.cell_height);
            } else if (SHOW_POSSIBLE_TILES) {
                //continue;
                for (let k = 0; k < cell.options.length; k++) {
                    let tile = tiles[cell.options[k]];
                    let i2 = k % NUM_TILES_X;
                    let j2 = (k - i2) / NUM_TILES_X;
                    tile.draw(
                        (i + i2 / NUM_TILES_X) * this.cell_width + padd, (j + j2 / NUM_TILES_X) * this.cell_height + padd,
                        this.cell_width / NUM_TILES_X - padd * 2, this.cell_height / NUM_TILES_X - padd * 2
                    );
                }
            }
        });
    }
}