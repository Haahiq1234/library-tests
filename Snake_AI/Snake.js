class Snake {
    constructor(x, y, colA, colB) {
        this.colA = colA;
        this.colB = colB;
        this.foodcolor = color(255, 0, 0);
        this.body = [new Vector2(x, y)];
        this.velx = 0;
        this.vely = 0;

        this.previous = this.body[0];
        this.food = [];

    }
    init(grid) {
        this.grid = grid;
        this.grid.set(this.body[0].x, this.body[0].y, 1);

        for (var i = 0; i < 4; i++) {
            this.addFood();
        }
    }
    update() {
        this.updategriddata();
        this.target = this.calculateClosestFood();
        this.vel = this.calculateVel();
        if (!this.vel) {
            return;
        }
        let previoushead = this.body[this.body.length - 1];
        let nPos = new Vector2(
            constraint(previoushead.x + this.vel.x, 0, this.grid.width - 1),
            constraint(previoushead.y + this.vel.y, 0, this.grid.height - 1)
        );
        let gridVal = this.grid.get(nPos.x, nPos.y);
        if (gridVal > 1) {
            this.grid.end();
            return;
        }
        this.prevtail = this.body.shift();
        for (var i = 0; i < this.food.length; i++) {
            if (this.food[i].x == nPos.x && this.food[i].y == nPos.y) {
                this.food.splice(i, 1);
                this.body.unshift(this.prevtail);
                this.addFood();
                break;
            }
        }
        this.body.push(nPos);
    }
    get head() {
        return this.body[this.body.length - 1];
    }
    calculateClosestFood() {
        return Vector.fromOrigin.nearest(this.body[this.body.length - 1], this.food)[0];
    }
    calculateVel() {
        let head = this.head;
        let vel = follow(head, this.target);
        let nPos = Vector.add(vel, head);
        let neighbours = this.getNeighbours(head);
        if (neighbours.length == 0) {
            this.grid.end();
            return;
        }
        let nearest = Vector.fromOrigin.nearest(nPos, neighbours)[0];
        //console.log(nearest, head);
        return Vector.sub(nearest, head);
    }
    getNeighbours(pos) {
        let neighbours = [];
        if (this.grid.IsValid(pos.x - 1, pos.y)) {
            neighbours.push(new Vector2(pos.x - 1, pos.y));
        }
        if (this.grid.IsValid(pos.x + 1, pos.y)) {
            neighbours.push(new Vector2(pos.x + 1, pos.y));
        }
        if (this.grid.IsValid(pos.x, pos.y - 1)) {
            neighbours.push(new Vector2(pos.x, pos.y - 1));
        }
        if (this.grid.IsValid(pos.x, pos.y + 1)) {
            neighbours.push(new Vector2(pos.x, pos.y + 1));
        }
        return neighbours;
    }
    addFood() {
        let pos = new Vector2(Random.rangeInt(this.grid.width), Random.rangeInt(this.grid.height));
        if (this.grid.get(pos.x, pos.y) == 0) {
            this.food.push(pos);
            return pos;
        }
        return this.addFood();
    }
    draw() {
        for (var i = 0; i < this.body.length; i++) {
            let t = normalize(i, 0, max(this.body.length - 1, 1));
            let col = this.colA.map((a, j) => a * (1 - t) + this.colB[j] * t);
            fill(col);
            rect(this.body[i].x * this.grid.cellwidth, this.body[i].y * this.grid.cellheight, this.grid.cellwidth, this.grid.cellheight);
        }
        fill(this.foodcolor);
        for (var i = 0; i < this.food.length; i++) {
            rect(this.food[i].x * this.grid.cellwidth, this.food[i].y * this.grid.cellheight, this.grid.cellwidth, this.grid.cellheight);
        }
    }
    updategriddata() {
        for (var i = 0; i < this.body.length; i++) {
            this.grid.set(this.body[i].x, this.body[i].y, i + 1);
        }
        for (var i = 0; i < this.food.length; i++) {
            this.grid.set(this.food[i].x, this.food[i].y, -1);
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