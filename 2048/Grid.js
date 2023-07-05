const colors = [
    "rgb(218, 195, 177)",
    "rgb(238, 228, 218)",
    "rgb(237, 224, 200)",
    "rgb(242, 177, 121)",
    "rgb(245, 149, 99)",
    "rgb(246, 124, 96)",
    "rgb(246, 94, 59)",
    "rgb(237, 207, 115)",
    "rgb(237, 204, 98)",
    "rgb(237, 200, 80)",
    "rgb(237, 197, 63)",
    "rgb(237, 194, 45)"
];

const MOVE_DURATION = 5;

class Grid extends Array2D {
    padding = 5;
    backGroundColor = "rgb(189, 177, 165)";
    choices = [
        1, 2, 3
    ];
    constructor(width, height) {
        super(width, height);
        this.addRandom();
        let graph = this;
        on.start.bind(() => graph.init());
    }
    init() {
        this.cellwidth = CanvasWidth / this.width;
        this.cellheight = CanvasHeight / this.height;
        noStroke();
    }
    addRandom(possibilities = this.getPossibilities()) {
        if (this.added) return; 
        this.added = true;
        let choice = Random.element(this.choices);
        if (possibilities.length == 0) {
            this.checkGameState();
            return;
        }
        let pos = Random.element(possibilities);
        this.set(pos.x, pos.y, choice);
    }
    move(dimension, start) {
        if (dimension == 0) {
            let end = (this.height - 1) - start;
            for (var j = 0; j < this.height; j++) {
                this.operate(start, j, end, j);
            }
        } else if (dimension == 1) {
            let end = (this.width - 1) - start;
            for (var i = 0; i < this.width; i++) {
                this.operate(i, start, i, end);
            }
        }
    }
    operate(ax, ay, bx, by) {
        let width = abs(bx - ax);
        let height = abs(by - ay);

        let dx = sign(bx - ax);
        let dy = sign(by - ay);

        //console.log(ax, ay, bx, by);
        let positions = [];
        let arr = [];
        for (var i = 0; i <= width; i++) {
            let x = ax + dx * i;
            for (var j = 0; j <= height; j++) {
                let y = ay + dy * j;
                positions.push({x, y});
                arr.push(this.get(x, y));
            }
        }
        this.slide(arr, positions);
        console.log(arr);
    }
    slide(arr, positions) {

    }
    getPossibilities() {
        let possibilities = [];
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (this.get(i, j) == 0) {
                    possibilities.push(new Vector2(i, j));
                }
            }
        }
        return possibilities;
    }
    draw() {
        backGround(this.backGroundColor);
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let value = this.get(i, j);
                let x = i * this.cellwidth;
                let y = j * this.cellheight;
                fill(colors[0]);
                rect(x + this.padding, y + this.padding, this.cellwidth - this.padding * 2, this.cellheight - this.padding * 2);
                this.cell(x, y, value);
            }
        }
    }
    cell(x, y, val) {
        if (val == 0) return;
        fill(colors[val]);
        rect(x + this.padding, y + this.padding, this.cellwidth - this.padding * 2, this.cellheight - this.padding * 2);
        let str = (2 ** val).toString();
        fill(0);
        textSize(35);
        text(str, x + this.cellwidth / 2, y + this.cellheight / 2);
    }
    checkGameState() {
        for (var i = 0; i < this.width - 1; i++) {
            for (var j = 0; j < this.height - 1; j++) {
                let val = this.get(i, j);
                if (val == this.get(i, j + 1) || val == this.get(i + 1, j)) return;
            }
        }
        alert("game Ended");
        noLoop();
    }
}
function slidingZero(a, b) {
    let condition = (b == 0);
    if (condition && a == 0) return 0;
    return condition ? -1 : 0;
}
function combine(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i] == arr[i + 1] && arr[i] > 0) {
            arr[i]++;
            arr[i + 1] = 0;
        } 
    }
    console.log(arr);
    return arr;
}
function getSortingOrder(arr, f) {
    let order = [];
    for (var i = 0; i < arr.length; i++) {
        order.push(i);
    }
    order.sort((a, b) => f(arr[a], arr[b]));
    return order;
}
function orderUsingDimension(d, x, y) {
    if (d == 0) {
        return [x, y];
    } else {
        return [y, x];
    }
}