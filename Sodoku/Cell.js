const default_arr = new Array(9).fill(0).map((v, i) => i + 1);
console.log(default_arr);
class Cell {
    constructor(i, j, grid) {
        this.grid = grid;

        this.i = i;
        this.j = j;

        this.cw = this.grid.cell_width;
        this.ch = this.grid.cell_height;

        this.x = this.i * this.cw;
        this.y = this.j * this.ch;

        this.options = [...default_arr];
        this.optionRemover = [];
        this.value = 0;
    }
    draw() {
        rect(this.x, this.y, this.cw, this.ch);
        if (this.value > 0) {
            fill(0);
            text(this.value, this.x + this.cw / 2, this.y + this.ch / 2);
            nofill();
        }
    }
    get collapsed() {
        return this.value > 0;
    }
    random_val() {
        console.log(this.options.length, this.i, this.j);
        if (this.options.length == 0) {
            console.log(this.optionRemover);
            noLoop();
        }
        return this.options[0];
    }
    IsDifferent(cell) {
        if (cell.i == this.i || cell.j == this.j) {
            return false;
        }
        if (floorDiv(cell.i, 3) == floorDiv(this.i, 3) && floorDiv(cell.j, 3) == floorDiv(this.j, 3)) {
            return false;
        }
        return true;
    }
    remove(option, cellThatDibbed) {
        if (this.IsDifferent(cellThatDibbed)) {
            console.log("ERROR: Wrong cell tried to remove option");
            return;
        }
        for (let i = 0; i < this.options.length; i++) {
            if (this.options[i] == option) {
                this.options.splice(i, 1);
                this.optionRemover.push([option, cellThatDibbed.i, cellThatDibbed.j]);
                if (this.options.length == 0 && !this.collapsed) {
                    console.log("No options left");
                    console.log(this.optionRemover);
                    noLoop();
                    return true;
                }
                return;
            }
        }
    }
    collapse(val) {
        if (this.options.length == 0) {
            console.log("No options left");
            console.log(this.optionRemover);
            noLoop();
        }
        if (this.value == 0) {
            this.value = val;
            //console.log(this.value);
        }
        return this.value;
    }
}