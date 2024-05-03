/// <reference path="../Canvas.js" />

const PADDING = 0;

const colors = {
    0: color(255, 255, 0),
    1: color(0, 185, 63),
    2: color(0, 104, 255),
    3: color(122, 0, 229),
    4: color(255, 0, 0),
};

class Grid extends Array2D {
    constructor(width, height) {
        super(width, height);
        this.buffer = new Array2D(width, height, 0);
    }
    initialize() {
        this.cellWidth = CanvasWidth / this.width;
        this.cellHeight = CanvasHeight / this.height;

        this.array.fill(1);
        this.set(0, 0, 140); // 140
        this.set(this.width - 1, this.height - 1, 1000); // 1000
        this.set(this.width / 2, this.height / 2, 500); // 500
    }
    update() {
        let grid = this;
        this.buffer.array.fill(0);
        this.forEach(function (i, j, value, index) {
            if (value < 4) {
                this.buffer.array[index] += value;
            } else {
                let toSet = value;
                if (i > 0) {
                    toSet--;
                    let index = this.index(i - 1, j);
                    this.buffer.array[index]++;
                }
                if (j > 0) {
                    toSet--;
                    let index = this.index(i, j - 1);
                    this.buffer.array[index]++;
                }
                if (i < (this.width - 1)) {
                    //console.log(i, j);
                    toSet--;
                    let index = this.index(i + 1, j);
                    this.buffer.array[index]++;
                }
                if (j < (this.height - 1)) {
                    toSet--;
                    let index = this.index(i, j + 1);
                    //console.log(index, i, j + 1);
                    this.buffer.array[index]++;
                }
                this.buffer.array[index] += toSet;
            }
        });
        let temp = this.buffer.array;
        this.buffer.array = this.array;
        this.array = temp;
    }
    draw() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let val = this.get(i, j);
                fill(colors[val > 3 ? 4 : val]);
                rect(
                    i * this.cellWidth + PADDING,
                    j * this.cellHeight + PADDING,
                    this.cellWidth - PADDING * 2,
                    this.cellHeight - PADDING * 2
                );
            }
        }
    }
}