const DISTANCE_FROM_END_PERCENTAGE = 10;
const T = DISTANCE_FROM_END_PERCENTAGE / 100;
const MAX_STEPS_PER_FRAME = 10;


class Grid extends Array2D {
    constructor(w, h) {
        super(w, h);
        var grid = this;
        on.start.bind(() => grid.init());
    }
    resize(w, h) {
        super.resize(w, h);

        this.cellwidth = CanvasWidth / this.width;
        this.cellheight = CanvasHeight / this.height;

        this.startPos = new Vector2(0, 0);
        this.targetPos = new Vector2(w - 1, h - 1);

        this.path = [this.startPos.copy()];
        lineCap("round");
    }
    cost(i, j) {
        let val = this.get(i, j);
        if (val == 1 || val == 4) {
            return -1;
        }
        let pos = new Vector2(i, j);
        return Vector.dist2(pos, this.targetPos) * (1 - T) + Vector.dist2(pos, this.startPos) * T;

        //return Vector.dist(pos, this.targetPos) * (1 - T) + Vector.dist(pos, this.startPos) * T;
    }
    getNeighbours(i, j, pi, pj) {
        let neighbours = [];
        let isSx = i > 0;
        let isSy = j > 0;
        let isLx = i < this.width - 1;
        let isLy = j < this.height - 1;
        if (isLx && isLy) {
            neighbours.push([i + 1, j + 1, this.cost(i + 1, j + 1)]);
        }
        if (isSx && isSy) {
            neighbours.push([i - 1, j - 1, this.cost(i - 1, j - 1)]);
        }
        if (isSx && isLy) {
            neighbours.push([i - 1, j + 1, this.cost(i - 1, j + 1)]);
        }
        if (isLx && isSy) {
            neighbours.push([i + 1, j - 1, this.cost(i + 1, j - 1)]);
        }
        if (isSx) {
            neighbours.push([i - 1, j, this.cost(i - 1, j)]);
        }
        if (isSy) {
            neighbours.push([i, j - 1, this.cost(i, j - 1)]);
        }
        if (isLx) {
            neighbours.push([i + 1, j, this.cost(i + 1, j)]);
        }
        if (isLy) {
            neighbours.push([i, j + 1, this.cost(i, j + 1)]);
        }
        for (var k = 0; k < neighbours.length; k++) {
            let n = neighbours[k];
            let broken = false;
            for (var l = 0; l < this.path.length - 1; l++) {
                let p = this.path[l];
                if (mag((p.x - n[0]), p.y - n[1]) < 1.2) {
                    neighbours.splice(k, 1);
                    k--;
                    broken = true;
                    break;
                }
            }
            if (broken) {
                continue;
            }
            if (n[2] == -1 || (n[0] == pi && n[1] == pj)) {
                neighbours.splice(k, 1);
                k--;
            }
        }
        neighbours.sort((a, b) => a[2] - b[2]);
        //console.table(neighbours);
        return neighbours;
    }
    init() {
        this.resize(this.width, this.height);
        this.generate();
    }
    generate() {
        this.forEach(function (i, j, val, index) {
            return Random.range(0, 2) < 0.5 ? 1 : 0;
        }, true);
        this.set(this.startPos.x, this.startPos.y, 2);
        this.set(this.targetPos.x, this.targetPos.y, 3);
    }
    draw() {
        let ended = this.next();
        if (ended) {
            //return;
        }
        this.forEach(function (i, j, val) {
            this.cell(i, j, val);
        }, false);
        stroke(255, 0, 0);
        lineWidth(this.cellwidth / 3);
        let prev = this.path[0];
        for (var i = 1; i < this.path.length; i++) {
            let cur = this.path[i];
            let ax = (cur.x + 0.5) * this.cellwidth;
            let ay = (cur.y + 0.5) * this.cellheight;
            let bx = (prev.x + 0.5) * this.cellwidth;
            let by = (prev.y + 0.5) * this.cellheight;
            //console.log(ax, ay, bx, by);
            line(ax, ay, bx, by);
            prev = cur;
        }
        lineWidth(1);
        stroke(0);
    }
    next() {
        for (var i = 0; i < MAX_STEPS_PER_FRAME; i++) {
            let prev = this.path[this.path.length - 1];
            let neighbours;
            if (this.path.length == 1) {
                neighbours = this.getNeighbours(prev.x, prev.y, prev.x - 2, prev.y);
            } else {
                neighbours = this.getNeighbours(prev.x, prev.y, this.path[this.path.length - 2].x, this.path[this.path.length - 2].y);
            }
            if (neighbours.length > 0) {
                let pos = new Vector2(neighbours[0][0], neighbours[0][1])
                if (this.push(pos)) {
                    console.log("Path found");
                    return true;
                }
            } else {
                if (this.pop()); {
                    console.log("Path Ended");
                    return true;
                }
            }

        }
        //console.log(this.path.length);
    }
    push(pos) {
        this.path.push(pos);
        if (Vector.Equal(pos, this.targetPos)) {
            noLoop();
            return true;
        }
    }
    pop() {
        let popped = this.path.pop();
        console.log(this.path.length == 0, this.path.length);
        if (this.path.length == 0) {
            noLoop();
            return true;
        }
        this.set(popped.x, popped.y, 4);
        //console.log("Returning false");
        return false;
    }
    cell(i, j, val) {
        if (val == 1) {
            fill(0);
            circle((i + 0.5) * this.cellwidth, (j + 0.5) * this.cellheight, this.cellwidth / 5 * 2);
            nofill();
        } else if (val == 2 || val == 3) {
            fill(0, 255, 0);
        } else if (val == 4) {
            fill(255, 0, 0);
        } else if (val == 0) {
            fill(255);
        }
        rect(i * this.cellwidth, j * this.cellheight, this.cellwidth, this.cellheight);
    }
}
