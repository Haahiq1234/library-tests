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

        this.array.fill(0);
        this.set(0, 0, 70); // 140
        this.set(this.width - 1, this.height - 1, 250); // 1000
        this.set(this.width / 2, this.height / 2, 125); // 500
    }
    update() {
        this.buffer.array = new Array(this.width * this.height);
        this.buffer.forEach(function (i, j, value) {

        });
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