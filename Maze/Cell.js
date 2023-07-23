const UP = 0;
const RIGHT = 1;
const LEFT = 2;
const DOWN = 3;
const PADDING = 0.2;
const INVERSE_PADDING = 1 - PADDING * 2;

class Cell {
    parent;
    dist = 0;
    children = [];
    constructor(i, j, grid) {
        this.checked = false;
        this.walls = new Array(4).fill(true);
        this.i = i;
        this.j = j;
        this.grid = grid;
    }
    draw(cw, ch) {
        if (this.checked) {
            this.rect(cw, ch)
        }
        if (this.walls[UP]) {
            line((this.i) * cw, (this.j) * ch, (this.i + 1) * cw, (this.j) * ch);
        }
        if (this.walls[DOWN]) {
            line((this.i) * cw, (this.j + 1) * ch, (this.i + 1) * cw, (this.j + 1) * ch);
        }
        if (this.walls[RIGHT]) {
            line((this.i + 1) * cw, (this.j) * ch, (this.i + 1) * cw, (this.j + 1) * ch);
        }
        if (this.walls[LEFT]) {
            line((this.i) * cw, (this.j) * ch, (this.i) * cw, (this.j + 1) * ch);
        }
    }
    rect(cw, ch) {
        rect((this.i) * cw, (this.j) * ch, cw, ch);
    }
}