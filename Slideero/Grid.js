const FRAMES_PER_MOVE = 10;


class Grid extends Array2D {
    padding = 0;
    rectPadding = 5;
    running = false;
    constructor(width, height) {
        super(width, height);
        this.positions = new Array2D(width, height);
        var grid = this;
        on.pointerdown.bind((x, y) => grid.onpointerdown(x, y));
    }
    preview(width, height) {
        this.resize(width, height);
        this.draw();
    }
    set image(im) {
        this._image = im;
        if (!im) return;
        this.imagecellwidth = this._image.width / this.width;
        this.imagecellheight = this._image.height / this.height;
    }
    resize(width, height) {
        super.resize(width, height);
        this.positions.resize(width, height);    
        this.image = this._image;
        this.cellwidth = CanvasWidth / this.width;
        this.cellheight = CanvasHeight / this.height;
        this.recalculatePositions();
        this.forEach((i, j, val, ind)=>ind);
    }
    shuffleGrid(n) {
        for (let i = 0; i < n; i++) {
            let neighbour = this.getRandomNeighbour(
                this.freeSpot.x,
                this.freeSpot.y
            );
            this.move(neighbour.x, neighbour.y, false);
        }
    }
    hasEnded() {
        for (var i = 0; i < this.array.length - 1; i++) {
            if (this.array[i] != i) {
                return false;
            }
        }
        return true;
    }
    getRandomNeighbour(x, y) {
        let neighbours = [];
        if (x > 0) {
            neighbours.push(new Vector2(x - 1, y));
        }
        if (y > 0) {
            neighbours.push(new Vector2(x, y - 1));
        }
        if (x < this.width - 1) {
            neighbours.push(new Vector2(x + 1, y));
        }
        if (y < this.height - 1) {
            neighbours.push(new Vector2(x, y + 1));
        }
        return Random.element(neighbours);
    }
    onpointerdown(x, y) {
        if (!this.running) return;
        x = floorDiv(x, this.cellwidth);
        y = floorDiv(y, this.cellheight);
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
        //console.log(x, y);
        this.move(x, y, true);
    }
    drawTimer() {

    }
    move(x, y, animate) {
        let pos = new Vector2(x, y);
        let dx = x - this.freeSpot.x;                                                                          
        let dy = y - this.freeSpot.y;
        if (abs(dx) + abs(dy) == 1) {
            let index = this.get(x, y);
            this.set(x, y, -1);
                this.set(this.freeSpot.x, this.freeSpot.y, index);
            if (animate) {
                this.positions.set(
                    this.freeSpot.x,
                    this.freeSpot.y,
                    new Vector2(x * this.cellwidth, y * this.cellheight)
                );
                let b = this.freeSpot;
                let cw = this.cellwidth;
                let ch = this.cellheight;
                var grid = this;
                this.animation = new Animator([], FRAMES_PER_MOVE, function (t) {
                    let pos = new Vector2(
                        ((1 - t) * x + t * b.x) * cw,
                        ((1 - t) * y + t * b.y) * ch
                    );
                    grid.positions.set(b.x, b.y, pos);
                }, function () { grid.positions.set(b.x, b.y, new Vector2(b.x * cw, b.y * ch)) });
            } else {
            }
            this.freeSpot = pos;
        }
    }

    draw() {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                let pos = this.positions.get(i, j);
                this.cell(i, j, i * this.cellwidth, j * this.cellheight)
            }
        }
        if (this.hasEnded() && this.running) {
            this.end();
        }
        //console.log(running);
    }
    recalculatePositions() {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                this.positions.set(
                    i,
                    j,
                    new Vector2(i * this.cellwidth, j * this.cellheight)
                );
            }
        }
    }
    cell(i, j, x, y) {
        if (this._image) {
            return this.drawImageCell(i, j, x, y);
        }
        return this.drawNumberCell(i, j, x, y);
    }
    drawImageCell(i, j, x, y) {
        let value = this.get(i, j);
        if (value == -1) return;
        let pos = this.pos(value);
        image(
            this._image,
            pos.x * this.imagecellwidth,
            pos.y * this.imagecellheight,
            this.imagecellwidth,
            this.imagecellheight,
            x + this.padding,
            y + this.padding,
            this.cellwidth - this.padding * 2,
            this.cellheight - this.padding * 2
        );
    }
    drawNumberCell(i, j, x, y) {
        let value = this.get(i, j);
        if (value == -1) return true;
        let index = (value + 1).toString();
        let pos = this.pos(value);
        let toReturn = false;
        if (pos.x == i && pos.y == j) {
            fill(0, 255, 0);
            toReturn = true;
        } else {
            fill(0, 0, 255);
        }
        rect(
            x + this.rectPadding,
            y + this.rectPadding,
            this.cellwidth - this.rectPadding * 2,
            this.cellheight - this.rectPadding * 2
        );
        fill(255, 255, 0);
        textSize(55 - (index.length - 1) * 5 - this.width * 5);
        text(index, x + this.cellwidth / 2, y + this.cellheight / 2);
        return toReturn;
    }
    begin() {
        this.freeSpot = new Vector2(this.width - 1, this.height - 1);
        this.set(this.freeSpot.x, this.freeSpot.y, -1);
        this.shuffleGrid(((this.width * this.height) ** 2));
        this.running = true;
    }
    end() {
        this.set(
            this.freeSpot.x,
            this.freeSpot.y,
            this.index(this.freeSpot.x, this.freeSpot.y)
        );
        this.running = false;
        game.openMenu();
    }
}
