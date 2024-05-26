///<reference path="../Canvas.js"/>
///<reference path="../Animator.js"/>


const FRAMES_PER_MOVE = 10;

class Grid extends Array2D {
    padding = 5;
    running = false;
    constructor(width, height) {
        super(width, height);
        this.queue = [];
        this.start_time = 0;
    }
    /**
     * @param {Image} im
     */
    set image(im) {
        this._image = im;
        if (!im) return;
        this.image_cell_width = this._image.width / this.width;
        this.image_cell_height = this._image.height / this.height;
    }
    resize(width, height) {
        super.resize(width, height);
        this.image = this._image;
        this.cell_width = CanvasWidth / this.width;
        this.cell_height = CanvasHeight / this.height;
        this.setEach((i, j, ind) => ind);
    }
    preview(width, height, padding = 5) {
        this.resize(width, height);
        this.draw(padding, true);
    }
    shuffle_grid(n) {
        let free = this.current;
        let prev = new Vector2(-1, -1);
        for (let i = 0; i < n; i++) {
            let neighbour = this.get_neighbour(
                free.x,
                free.y,
                prev
            );
            prev = free;
            free = neighbour;
            this.move(neighbour.x, neighbour.y, false, 3);
        }
    }
    has_ended() {
        let incorrect_cells = 0;
        for (var i = 0; i < this.array.length; i++) {
            if (this.array[i] != i) {
                incorrect_cells++;
            }
        }
        return incorrect_cells == 1;
    }
    get_neighbour(x, y, prev) {
        let neighbours = [];
        if (x > 0 && x - 1 != prev.x) {
            neighbours.push(new Vector2(x - 1, y));
        }
        if (y > 0 && y - 1 != prev.y) {
            neighbours.push(new Vector2(x, y - 1));
        }
        if (x < this.width - 1 && x + 1 != prev.x) {
            neighbours.push(new Vector2(x + 1, y));
        }
        if (y < this.height - 1 && y + 1 != prev.y) {
            neighbours.push(new Vector2(x, y + 1));
        }
        return Random.element(neighbours);
    }
    onpointerdown(x, y) {
        x = floorDiv(x, this.cell_width);
        y = floorDiv(y, this.cell_height);
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
        this.move(x, y, true);
    }
    move(x, y, animate, animationDuration = FRAMES_PER_MOVE) {
        var grid = this;
        if (animate && this.animation && this.animation.isRunning) {
            // checking wether the previous animation is still running and if it is, then it just appends it to the queue
            this.queue.push([x, y, animationDuration]);
            return;
        }
        let pos = new Vector2(x, y);
        let dx = x - this.current.x;
        let dy = y - this.current.y;
        if (abs(dx) + abs(dy) == 1) {
            let index = this.get(x, y);
            if (index >= this.array.length) {
                index -= this.array.length;
            }
            this.set(x, y, -1);
            if (animate) {
                this.set(this.current.x, this.current.y, index + this.array.length);
                let b = this.current;
                let cw = this.cell_width;
                let ch = this.cell_height;
                let animation = new AnimationHandler(
                    b,
                    animationDuration,
                    function (t) {
                        let pos = new Vector2(
                            (x - t * dx) * cw,
                            (y - t * dy) * ch
                        );
                        grid.cell(pos.x, pos.y, index);
                    }, function () {
                        grid.cell(b.x * grid.cell_width, b.y * grid.cell_height, index);
                        grid.set(b.x, b.y, index);
                        if (grid.queue.length > 0) {
                            let p = grid.queue.shift();
                            grid.move(p[0], p[1], true, p[2]);
                        }
                    });
                animation.run();
                this.animation = animation;
            } else {
                this.set(this.current.x, this.current.y, index);
            }
            this.previous = this.current;
            this.current = pos;
        }
    }
    update() {
        this.draw();
        //console.log(time);
    }
    draw(padding = 0, preview = false) {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                let val = this.get(i, j);
                if (val == -1 || val >= this.array.length) continue;
                this.cell(i * this.cell_width, j * this.cell_height, val, padding);
            }
        }
        if (this.has_ended() && this.running) {
            this.end();
        }
        //console.log(running);
    }
    draw_time() {
        let time = 0;
        if (!this.running) {
            time = floor(this.start_time / 1000);
        } else {
            time = floor((performance.now() - this.start_time) / 1000);
        }
        fill(255, 0, 0);
        textAlign('left', 'bottom');
        textSize(30);
        text(time, 20, CanvasHeight - 20);

    }
    cell(x, y, val, padding = 0) {
        if (this._image) {
            return this.draw_cell_i(x, y, val, padding);
        }
        return this.draw_cell_n(x, y, val);
    }
    draw_cell_i(x, y, val, padding = 0) {
        let value = val;
        if (value == -1) return;
        let pos = this.pos(value);
        image(
            this._image,
            pos.x * this.image_cell_width,
            pos.y * this.image_cell_height,
            this.image_cell_width,
            this.image_cell_height,
            x + padding,
            y + padding,
            this.cell_width - padding * 2,
            this.cell_height - padding * 2
        );
    }
    draw_cell_n(x, y, val) {
        let value = val;
        if (value == -1) return true;
        let index = (value + 1).toString();
        let pos = this.pos(value);
        if (abs(pos.x - x / this.cell_width) + abs(pos.y - y / this.cell_height) < 0.25) {
            fill(0, 255, 0);
        } else {
            fill(0, 0, 255);
        }
        rect(
            x + this.padding,
            y + this.padding,
            this.cell_width - this.padding * 2,
            this.cell_height - this.padding * 2
        );
        fill(255, 255, 0);
        textSize(55 - (index.length - 1) * 5 - this.width * 5);
        textAlign('center', 'middle');
        text(index, x + this.cell_width / 2, y + this.cell_height / 2);
    }
    begin() {
        this.current = new Vector2(this.width - 1, this.height - 1);
        this.set(this.current.x, this.current.y, -1);
        this.running = true;
        this.shuffle_grid(((this.width * this.height) ** 2));
        this.start_time = performance.now();
    }
    end() {
        this.set(
            this.current.x,
            this.current.y,
            this.index(this.current.x, this.current.y)
        );
        this.start_time = performance.now() - this.start_time;
        this.running = false;
        game.open_main_menu();
    }
}
