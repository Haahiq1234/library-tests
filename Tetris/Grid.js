class Grid extends Array2D {
    static Instance;
    padding = 5;
    border_radius = 4;
    constructor(w, h) {
        super(w, h);
        this.start = new Vector2(floor(w / 2), 1);
        Grid.Instance = this;
        this.gravity = new Vector2(0, 1);


        var grid = this;
        on.start.bind(() => grid.init());
        on.keydown.bind(() => grid.keydown());
    }
    init() {
        this.cellwidth = WIDTH / this.width;
        this.cellheight = HEIGHT / this.height;
        this.reselect();
    }
    update() {
        this.current.update();
        this.draw();
    }
    draw() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let val = this.get(i, j);
                if (val != 0) {
                    this.cell(i, j, val);
                } else {
                    nofill();
                    stroke(0, 100);
                    rect(i * this.cellwidth, j * this.cellheight, this.cellwidth, this.cellheight);
                }
            }
        }
    }
    keydown() {
        if (keyCode == key.up) {
            this.current.rotate();
        } else if (keyCode == key.left) {
            this.current.tryMove(new Vector2(-1, 0));
        } else if (keyCode == key.right) {
            this.current.tryMove(new Vector2(1, 0));
        } else if (keyCode == key.down) {
            this.current.tryMove(new Vector2(0, 1));
        } else if (keyCode == key.space) {
            this.current.forceFinish();
        }
    }
    cell(i, j, col) {
        let x = i * this.cellwidth;
        let y = j * this.cellheight;
        noStroke();
        fill(col);
        rect(x, y, this.cellwidth, this.cellheight);
        fill(0, 100);
        squircle(
            x + this.padding, y + this.padding,
            this.cellwidth - this.padding * 2, this.cellheight - this.padding * 2,
            this.border_radius
        );
        fill(255);
        squircle(
            x + this.padding + this.border_radius, y + this.padding + this.border_radius,
            this.cellwidth - this.padding * 2 - this.border_radius * 2, this.cellheight - this.padding * 2 - this.border_radius * 2,
            this.border_radius / 2
        );
    }
    reselect() {
        this.current = new Shape(this, 30);
    }
    possible(points) {
        for (var point of points) {
            if (point.x < 0 || point.y < 0 || point.x >= this.width || point.y >= this.height || this.get(point.x, point.y) != 0) {
                return false;
            }
        }
        return true;
    }
    check(ay, by) {
        let bottom = -1;;
        let layers = 0;
        for (let j = ay; j <= by; j++) {
            let isFull = true;
            for (var i = 0; i < this.width; i++) {
                if (this.get(i, j) == 0) {
                    isFull = false;
                    break;
                }
            }
            if (isFull) {
                for (var i = 0; i < this.width; i++) {
                    this.set(i, j, 0);
                }
                bottom = max(bottom, j);
                layers++;
            }
        }
        if (layers > 0) {
            for (var j = bottom; j >= layers; j--) {
                for (var i = 0; i < this.width; i++) {
                    this.set(i, j, this.get(i, j - layers));
                }
            }
            for (var j = 0; j < layers; j++) {
                for (var i = 0; i < this.width; i++) {
                    this.set(i, j, 0);
                }
            }
        }
    }
    end() {
        noLoop();
        alert("GameOver");
    }
}