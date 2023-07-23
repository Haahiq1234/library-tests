const STEPS_PER_FRAME = 5;

class Grid extends Array2D {
    constructor(w, h) {
        super(w, h);
        var grid = this;
        on.start.bind(() => grid.init());
        on.mousedown.bind((x, y, b, e) => { grid.mousedown(x, y, b); e.preventDefault() });
        this.complete = false;
        this.completed = 0;
    }
    init() {
        this.cellwidth = CanvasWidth / this.width;
        this.cellheight = CanvasHeight / this.height;

        this.forEach(function (i, j) {
            return new Cell(i, j, this);
        }, true);

        this.path = [new Vector2()];
        this.maximum = [this.path.length, this.current];
    }
    get current() {
        return this.path[this.path.length - 1];
    }
    neighbours(i, j) {
        let ns = [];
        if (i > 0 && !this.get(i - 1, j).checked) {
            ns.push([new Vector2(i - 1, j), LEFT]);
        }
        if (j > 0 && !this.get(i, j - 1).checked) {
            ns.push([new Vector2(i, j - 1), UP]);
        }
        if (i < this.width - 1 && !this.get(i + 1, j).checked) {
            ns.push([new Vector2(i + 1, j), RIGHT]);
        }
        if (j < this.height - 1 && !this.get(i, j + 1).checked) {
            ns.push([new Vector2(i, j + 1), DOWN]);
        }
        return ns;
    }
    next() {
        for (var step = 0; step < STEPS_PER_FRAME; step++) {
            while (true) {
                let cur = this.current;
                let a = this.get(cur.x, cur.y);
                //console.log(cur);
                if (this.completed == this.length) {
                    this.end();
                    return;
                }
                if (!a.checked) {
                    a.checked = true;
                    this.completed++;
                }
                let ns = this.neighbours(cur.x, cur.y);
                if (ns.length == 0) {
                    this.path.pop();
                    continue;
                }
                //let n = ns[ns.length - 1];
                let n = Random.element(ns);
                a.walls[n[1]] = false;
                let b = this.get(n[0].x, n[0].y);
                b.walls[3 - n[1]] = false;
                b.parent = a;
                b.dist = this.path.length;
                a.children.push(b);
                this.path.push(n[0]);
                if (this.path.length > this.maximum[0]) {
                    this.maximum[0] = this.path.length;
                    this.maximum[1] = n[0];
                }
                break;
            }
        }
    }
    mousedown(x, y, b) {
        if (!this.complete) return;
        let i = floor(x / this.cellwidth);
        let j = floor(y / this.cellheight);
        if (i >= 0 && j >= 0 && i < this.width && j < this.height) {
            if (b == 2) {
                this.clicked = new Vector2(this.maximum[1].x, this.maximum[1].y);
            } else {
                this.clicked = new Vector2(i, j);
            }
        }
    }
    end() {
        this.complete = true;
        console.log("Generated Maze");
        this.forEach(function (i, j, cell) {
            cell.checked = false;
        }, false);
    }
    update() {
        if (this.complete) return;
        this.next();
    }
    draw() {
        fill("purple");
        if (this.clicked) {
            let cur = this.get(this.clicked.x, this.clicked.y);
            this.rect(cur.i, cur.j, PADDING, INVERSE_PADDING);
            while (cur.parent) {
                this.rect((cur.i + cur.parent.i) / 2, (cur.j + cur.parent.j) / 2, PADDING, INVERSE_PADDING);
                cur = cur.parent;
                this.rect(cur.i, cur.j, PADDING, INVERSE_PADDING);
            }
        }
        this.forEach(function (i, j, val) {
            val.draw(this.cellwidth, this.cellheight);
        }, false);
    }
    rect(i, j, pad, ip = 1 - pad * 2) {
        rect((i + pad) * this.cellwidth, (j + pad) * this.cellheight, this.cellwidth * ip, this.cellheight * ip);
    }
}