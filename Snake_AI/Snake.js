const MAX_STEPS = 1600;
const MAX_PATH_LENGTH = 5;

class Snake {
    constructor(x, y, colA, colB) {
        this.colA = colA;
        this.colB = colB;
        this.foodcolor = color(255, 0, 0);
        this.body = [new Vector2(x, y)];

        this.food = [];
        this.previous = this.body[0];
        this.tail = this.body[0];
        this.grid = new Grid(40, 40, this);
        this.sorted = false;
    }
    init() {
        this.grid.set(this.body[0].x, this.body[0].y, 1);

        for (var i = 0; i < 50; i++) {
            this.addFood();
        }
        this.sortFood();
        lineWidth(2);
    }
    neighbours(i, j, len, tar) {
        //console.log(len);
        let sn = this;
        let ns = this.grid.neighbours(i, j, len);
        ns = ns.map((val) => [val, Vector.dist(val, tar), sn.grid.get(val.x, val.y)]);
        ns = ns.filter((val) => val[2] - len < 1 || val[2] == -1);
        ns.sort((a, b) => a[1] - b[1]);
        //console.log(ns);
        return ns.map(val => val[0]);
        //console.log(ns);
    }
    next() {
        let start = this.head;
        let end = 0;
        let path = [start];
        let pns = [];
        for (var i = 0; i < MAX_STEPS && path.length < MAX_PATH_LENGTH && end < this.food.length; i++) {
            let head = path[path.length - 1];
            let ns = this.neighbours(head.x, head.y, max(0, path.length - 1 - end), this.food[end]);
            //console.log(ns);
            if (ns.length == 0) {
                let popped = path.pop();
                this.grid.set(popped.x, popped.y, -1);
                //console.log("Popped:", popped);
            } else {
                let pushed = ns[0];
                let val = this.grid.get(pushed.x, pushed.y);
                if (val - max(0, path.length - 1 - end) > 0) {
                    console.log("SHIT NO WORK. Btw invalid grid val is:", val - max(0, path.length - 1 - end));
                    if (ns.length == 1) {
                        let popped = path.pop();
                        this.grid.set(popped.x, popped.y, -1);
                        break;
                    } else {
                        pushed = ns[1];
                    }
                }
                if (Vector.Equal(this.food[end], pushed)) {
                    end++;
                }
                this.grid.set(pushed.x, pushed.y, path.length - 1 + this.body.length);
                path.push(pushed);
            }
            pns.push(ns);
            if (path.length == 0) {
                console.log("Path length:", path.length);
                this.grid.end();
                //console.log(pns);
                return this.head;
            }
        }
        //console.log(path.length);
        if (path.length == 1) {
            //console.log("No path");
            this.grid.end();
            return path[0];
        }
        if (path.length == 0) {
            return this.head;
        }
        return path[1];
    }
    update() {
        this.updategrid();
        this.previous = this.head;
        let next = this.next();
        if (!this.IsValid(next)) {
            console.log(next, this.body);
            //this.grid.end();
            noLoop();
            return;
        }
        this.tail = this.body.shift();
        if (this.food[0].x == next.x && this.food[0].y == next.y) {
            this.food.splice(0, 1);
            this.body.unshift(this.tail);
            this.addFood();
        }
        this.body.push(next);
        //this.sortFood();
    }
    IsValid(pos) {
        let i = pos.x;
        let j = pos.y;
        if (i < 0 || j < 0 || i >= this.grid.width || j >= this.grid.height) {
            return false;
        }
        for (var bod of this.body) {
            if (i == bod.x && j == bod.y) {
                return false;
            }
        }
        return true;
    }
    sortFood() {
        //if (this.sorted) return;
        this.sorted = true;
        // let food = this.food;
        // this.food = [];
        // let head = this.head;
        // while (food.length > 0) {
        //     let len = Infinity;
        //     let n = 0;
        //     for (var i = 0; i < food.length; i++) {
        //         let nLen = Vector.dist(food[i], head);
        //         if (nLen < len) {
        //             len = nLen;
        //             n = i;
        //         }
        //     }
        //     let prev = food.splice(n, 1)[0];
        //     this.food.push(prev);
        //     head = prev;
        // }
        this.food = this.food.map((p) => [p, Vector.dist(p, this.head)]);
        this.food.sort((a, b) => a[1] - b[1]);
        this.food = this.food.map((v) => v[0]);
    }
    get head() {
        return this.body[this.body.length - 1];
    }
    addFood() {
        let pos = new Vector2(Random.rangeInt(this.grid.width), Random.rangeInt(this.grid.height));
        if (this.grid.get(pos.x, pos.y) == 0) {
            this.food.push(pos);
            this.sorted = false;
            return pos;
        }
        //console.log("Invalid position");
        return this.addFood();
    }
    draw() {
        for (var i = 0; i < this.body.length; i++) {
            let t = normalize(i, 0, max(this.body.length - 1, 1));
            let col = this.colA.map((a, j) => a * (1 - t) + this.colB[j] * t);
            if (i == 0 || i == this.body.length - 1) {
                stroke(0);
            } else {
                noStroke();
            }
            fill(col);
            this.grid.rect(this.body[i].x, this.body[i].y, col);
            //rect(this.body[i].x * this.grid.cellwidth, this.body[i].y * this.grid.cellheight, this.grid.cellwidth, this.grid.cellheight);
        }
        fill(this.foodcolor);
        for (var i = 0; i < this.food.length; i++) {
            rect(this.food[i].x * this.grid.cellwidth, this.food[i].y * this.grid.cellheight, this.grid.cellwidth, this.grid.cellheight);
        }
        this.grid.draw();
    }
    updategrid() {
        this.grid.array.fill(0);
        for (var i = 0; i < this.body.length; i++) {
            this.grid.set(this.body[i].x, this.body[i].y, i + 3);
        }
    }
}
function follow(eye, target) {
    let dx = target.x - eye.x;
    let dy = target.y - eye.y;
    if (abs(dx) > abs(dy)) {
        return new Vector2(sign(dx), 0);
    }
    return new Vector2(0, sign(dy));
}