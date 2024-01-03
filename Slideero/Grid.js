///<reference path="../Canvas.js"/>
///<reference path="../Animator.js"/>


const FRAMES_PER_MOVE = 10;

let grd;
class Grid extends Array2D {
    padding = 5;
    running = false;
    constructor(width, height) {
        super(width, height);
        var grid = this;
        grd = this;
        on.pointerdown.bind((x, y) => grid.onpointerdown(x, y));
        this.queue = [];
    }
    preview(width, height, padding = 5) {
        this.resize(width, height);
        this.draw(padding);
    }
    /**
     * @param {Image} im
     */
    set image(im) {
        this._image = im;
        if (!im) return;
        this.imagecellwidth = this._image.width / this.width;
        this.imagecellheight = this._image.height / this.height;
    }
    resize(width, height) {
        super.resize(width, height);
        this.image = this._image;
        this.cellwidth = CanvasWidth / this.width;
        this.cellheight = CanvasHeight / this.height;
        this.setEach((i, j, ind) => ind);
    }
    shuffleGrid(n) {
        let free = this.freeSpot;
        let prev = new Vector2(-1, -1);
        for (let i = 0; i < n; i++) {
            let neighbour = this.getRandomNeighbour(
                free.x,
                free.y,
                prev
            );
            prev = free;
            free = neighbour;
            this.move(neighbour.x, neighbour.y, true, 3);
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
    getRandomNeighbour(x, y, prev) {
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
        //console.log(neighbours);
        neighbours = neighbours.filter(v => !(v.x == prev.x && v.y == prev.y));
        //console.log(...neighbours, "prev", this.previousFreeSpot);
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
    move(x, y, animate, animationDuration = FRAMES_PER_MOVE) {
        var grid = this;
        if (animate && this.animation && this.animation.isRunning) { // checking wether the previous animation is still running and if it is, then it just appends it to the next move
            // this.animation.linkEndFunction(function () {
            //     grid.move(x, y, animate);
            // });
            this.queue.push([x, y, animationDuration]);
            return;
        }
        let pos = new Vector2(x, y);
        let dx = x - this.freeSpot.x;
        let dy = y - this.freeSpot.y;
        if (abs(dx) + abs(dy) == 1) {
            // if (this.animation && x == this.animation.data.x && y == this.animation.data.y) {
            //     this.animation.cancel();
            // }
            let index = this.get(x, y);
            if (index >= this.array.length) {
                index -= this.array.length;
            }
            this.set(x, y, -1);
            if (animate) {
                this.set(this.freeSpot.x, this.freeSpot.y, index + this.array.length);
                let b = this.freeSpot;
                let cw = this.cellwidth;
                let ch = this.cellheight;
                let animation = new AnimationHandler(
                    b,
                    animationDuration,
                    function (t) {
                        let pos = new Vector2(
                            ((1 - t) * x + t * b.x) * cw,
                            ((1 - t) * y + t * b.y) * ch
                        );
                        grid.cell(pos.x, pos.y, index);
                    }, function () {
                        grid.cell(b.x * grid.cellwidth, b.y * grid.cellheight, index);
                        grid.set(b.x, b.y, index);
                        if (grid.queue.length > 0) {
                            let p = grid.queue.shift();
                            grid.move(p[0], p[1], true, p[2]);
                        }
                    });
                animation.run();
                this.animation = animation;
            } else {
                this.set(this.freeSpot.x, this.freeSpot.y, index);
            }
            this.previousFreeSpot = this.freeSpot;
            this.freeSpot = pos;
        }
    }

    draw(padding = 0) {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                let val = this.get(i, j);
                if (val == -1 || val >= this.array.length) continue;
                this.cell(i * this.cellwidth, j * this.cellheight, val, padding);
            }
        }
        if (this.hasEnded() && this.running) {
            this.end();
        }
        //console.log(running);
    }
    cell(x, y, val, padding = 0) {
        if (this._image) {
            return this.drawImageCell(x, y, val, padding);
        }
        return this.drawNumberCell(x, y, val);
    }
    drawImageCell(x, y, val, padding = 0) {
        let value = val;
        if (value == -1) return;
        let pos = this.pos(value);
        image(
            this._image,
            pos.x * this.imagecellwidth,
            pos.y * this.imagecellheight,
            this.imagecellwidth,
            this.imagecellheight,
            x + padding,
            y + padding,
            this.cellwidth - padding * 2,
            this.cellheight - padding * 2
        );
    }
    drawNumberCell(x, y, val) {
        let value = val;
        if (value == -1) return true;
        let index = (value + 1).toString();
        let pos = this.pos(value);
        if (abs(pos.x - x / this.cellwidth) < 0.25 && abs(pos.y - y / this.cellheight) < 0.25) {
            fill(0, 255, 0);
        } else {
            fill(0, 0, 255);
        }
        rect(
            x + this.padding,
            y + this.padding,
            this.cellwidth - this.padding * 2,
            this.cellheight - this.padding * 2
        );
        fill(255, 255, 0);
        textSize(55 - (index.length - 1) * 5 - this.width * 5);
        text(index, x + this.cellwidth / 2, y + this.cellheight / 2);
    }
    begin() {
        this.freeSpot = new Vector2(this.width - 1, this.height - 1);
        this.set(this.freeSpot.x, this.freeSpot.y, -1);
        this.previousFreeSpot = this.freeSpot;
        this.running = true;
        this.shuffleGrid(((this.width * this.height) ** 2));
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
