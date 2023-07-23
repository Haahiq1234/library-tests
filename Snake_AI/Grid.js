class Grid extends Array2D {
    constructor(width, height, snake) {
        super(width, height);
        var grid = this;
        this.snake = snake;
        on.start.bind(() => grid.start());
    }
    start() {
        this.cellwidth = CanvasWidth / this.width;
        this.cellheight = CanvasHeight / this.height;
        this.snake.init();
    }
    neighbours(i, j, len = 0) {
        let neighbours = [];
        if (i > 0) {
            neighbours.push(new Vector2(i - 1, j));
        }
        if (j > 0) {
            neighbours.push(new Vector2(i, j - 1));
        }
        if (i < this.width - 1) {
            neighbours.push(new Vector2(i + 1, j));
        }
        if (j < this.height - 1) {
            neighbours.push(new Vector2(i, j + 1));
        }
        for (var k = 0; k < neighbours.length; k++) {
            let val = this.get(neighbours[k].x, neighbours[k].y);
            if (val == -1 || (val - len) > 0) {
                //console.log("Invalid Neighbour:", neighbours[k], val, val - len);
                neighbours.splice(k, 1);
            }
        }
        return neighbours;
    }
    IsValid(x, y) {
        let val = this.get(x, y);
        return (x >= 0 && y >= 0 && x < this.width && y < this.width && val == 0);
    }
    update() {

    }
    draw() {
        this.forEach(function (i, j, val) {
            // if (val != 0) {
            //     fill(0);
            //     rect(i * this.cellwidth, j * this.cellheight, this.cellwidth, this.cellheight);
            // }
            text(val, (i + 0.5) * this.cellwidth, (j + 0.5) * this.cellheight);
        }, false);
    }
    end() {
        alert("Gameover!");
        noLoop();
    }
    rect(i, j, col) {
        fill(col);
        rect(i * this.cellwidth, j * this.cellheight, this.cellwidth, this.cellheight);
    }
}