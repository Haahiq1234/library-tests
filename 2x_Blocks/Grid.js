const BORDER_RADIUS = 4;
const PADDING = 3;

const WIDTH = 300;
const HEIGHT = 420;

const X = (innerWidth - WIDTH) / 2;
const Y = (innerHeight - HEIGHT) / 2;

const DURATION = 5;

const COLORS = [
    color(234, 80, 79),
    color(30, 192, 113),
    color(251, 220, 43),
    color(23, 141, 211),
    color(192, 56, 234),
    color(223, 1, 128),
    color(245, 110, 30),
];

class Grid extends Array2D {
    constructor(w, h) {
        super(w, h);
        this.cell_width = WIDTH / this.width;
        this.cell_height = HEIGHT / this.height;
        this.set(0, 0, 1);
        this.set(1, 0, 2);
        this.set(2, 0, 3);
        this.set(3, 0, 4);
        this.set(4, 0, 5);

        this.choices = [];
        this.toDraw = [];
        for (var i = 0; i < 10; i++) {
            this.addChoice();
        }
        let grid = this;
        on.mousedown.bind((x, y, b) => grid.on_mouse_down(x, y, b));
    }
    addChoice() {
        this.choices.push(Random.rangeInt(COLORS.length - 3) + 1);
    }
    on_mouse_down(x, y, b) {
        let i = floor((x - X) / this.cell_width);
        //console.log(x, y, i);
        if (i >= 0 && y >= Y && i < this.width && y < Y + HEIGHT) {
            if (this.new_animation) {
                this.new_animation.cancel();
            }
            let j = this.height - 1;
            for (; j >= 0; j--) {
                if (this.get(i, j) != 0) {
                    j++;
                    break;
                }
            }
            let value = this.choices[0];
            if (j == this.height) {
                if (this.get(i, this.height - 1) == value) {
                    this.choices.shift();
                    this.addChoice();
                    this.set(i, this.height - 1, value + 1);
                }
                return;
            }
            let grid = this;
            this.choices.shift();
            this.addChoice();
            this.set(i, j, -value);
            this.toDraw.push([i * this.cell_width, (this.height - 1) * this.cell_height, value]);
            this.new_animation = animate([],
                DURATION,
                function (t) {
                    grid.cell(
                        i * grid.cell_width,
                        ((grid.height - 1) * (1 - t) + j * t) * grid.cell_height,
                        value
                    );
                }, function () {
                    grid.cell(
                        i * grid.cell_width,
                        j * grid.cell_height,
                        value
                    );
                    grid.set(i, j, value);
                    grid.update(i, j, value);
                });
        }
    }
    update(i, j, val) {
        let toAdd = [];
        if (i > 0 && this.get(i - 1, j) == val) {
            toAdd.push(new Vector2(i - 1, j));
        }
        if (i + 1 < this.width && this.get(i + 1, j) == val) {
            toAdd.push(new Vector2(i + 1, j));
        }
        if (j > 0 && this.get(i, j - 1) == val) {
            toAdd.push(new Vector2(i, j - 1));
        }
        if (toAdd.length > 0) {
            for (var k = 0; k < toAdd.length; k++) {
                this.set(toAdd[k].x, toAdd[k].y, 0);
            }
            this.set(i, j, val + toAdd.length);
            for (var k = 0; k < toAdd.length; k++) {
                this.update_column(toAdd[k].x);
            }
        }
    }
    update_column(i) {
        let col = this.getCol(i);
        let col_copy = [...col];
        let order = get_sorting_order(col, sorting_function);
        console.log(order);
        col.sort(sorting_function);
        this.setCol(i, col);
        for (var j = 0; j < col.length; j++) {
            if (col[j] != 0) {
                this.update(i, j, col[j]);
            }
        }
    }
    draw() {
        fill(0);
        squircle(
            -PADDING,
            -PADDING,
            WIDTH + PADDING * 2,
            HEIGHT + PADDING * 2,
            BORDER_RADIUS
        );
        squircle(
            WIDTH + 10 - PADDING,
            this.cell_height / 2 - PADDING,
            this.cell_width + PADDING * 2,
            this.cell_height * 4 + PADDING * 2,
            BORDER_RADIUS
        );
        this.forEach(function (i, j, value) {
            if (value != 0) {
                let x = i * this.cell_width;
                let y = j * this.cell_height;
                this.cell(x, y, value);
            }
        }, false);
        for (var i = 0; i < 4; i++) {
            this.cell(WIDTH + 10, this.cell_height * (i + 0.5), this.choices[i]);
        }

        while (this.toDraw.length > 0) {
            let draw = this.toDraw.pop();
            this.cell(...draw);
        }
    }
    cell(x, y, value) {
        let val = abs(value);
        if (value < 0) {
            setAlpha(122);
        }
        if (val > 0) {
            fill(COLORS[val - 1]);
            squircle(x + PADDING, y + PADDING, this.cell_width - PADDING * 2, this.cell_height - PADDING * 2, BORDER_RADIUS);
            if (val == 3) {
                fill(0);
            } else {
                fill(255);
            }
            text(2 ** val, x + this.cell_width / 2, y + this.cell_height / 2);
        }
        if (value < 0) {
            setAlpha(255);
        }
    }
}

function sorting_function(a, b) {
    return a != 0 && b == 0 ? -1 : 0;
}
function get_sorting_order(arr, func) {
    let order = (new Array(arr.length).fill(0)).map((x, i) => i);
    order.sort((a, b) => func(arr[a], arr[b]));
    return order;
}