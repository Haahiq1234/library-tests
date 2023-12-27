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

const DURATION = 50;

class Grid extends Array2D {
    MIN_PADDING = 5;
    MAX_PADDING = 5;
    backGroundColor = "rgb(189, 177, 165)";
    choices = [
        1, 2, 3
    ];
    currentDim;
    currentStart;
    constructor(width, height) {
        super(width, height);
        this.addRandom();
        let graph = this;
        on.start.bind(() => graph.init());
        this.combinations = [];
        this.currentCombining = [];
    }
    init() {
        this.cellwidth = CanvasWidth / this.width;
        this.cellheight = CanvasHeight / this.height;
        this.MAX_PADDING = min(this.cellwidth, this.cellheight) / 2;
        noStroke();
    }
    addRandom(possibilities = this.getPossibilities()) {
        let choice = Random.element(this.choices);
        if (possibilities.length == 0) {
            this.checkGameState();
            return;
        }
        let pos = Random.element(possibilities);
        this.set(pos.x, pos.y, choice);
    }
    slide(dim, start) {

        this.operate(dim, start, function (arr, positions) {
            arr = arr.sort(slidingZero);
            return [arr];
        });
    }
    combine(dim, start) {
        this.operate(dim, start, function (arr, positions) {
            for (var i = 0; i < arr.length - 1; i++) {
                if (arr[i] == arr[i + 1] && arr[i] > 0) {
                    arr[i + 1] = arr[i] + 1;
                    arr[i] = 0;
                    //this.combineTwo(positions[i].x, positions[i].y, positions[i + 1].x, positions[i + 1].y, arr[i]);
                }
            }
            return [arr];
        });
        //this.addRandom();
    }
    move(dimension, start) {
        this.slide(dimension, start);
        this.combine(dimension, start);
        this.slide(dimension, start);
        this.addRandom();
        return;
    }
    operate(dimension, start, func) {
        let toReturn = [];
        if (dimension == 0) {
            let end = (this.height - 1) - start;
            for (var j = 0; j < this.height; j++) {
                toReturn.push(this.operateBetween(start, j, end, j, func));
            }
        } else if (dimension == 1) {
            let end = (this.width - 1) - start;
            for (var i = 0; i < this.width; i++) {
                toReturn.push(this.operateBetween(i, start, i, end, func));
            }
        }
        return toReturn;
    }
    operateBetween(ax, ay, bx, by, func) {
        let width = abs(bx - ax);
        let height = abs(by - ay);

        let dx = sign(bx - ax);
        let dy = sign(by - ay);

        let arr = [];
        let positions = [];
        for (var i = 0; i <= width; i++) {
            let x = ax + dx * i;
            for (var j = 0; j <= height; j++) {
                let y = ay + dy * j;
                arr.push(this.get(x, y));
                positions.push({ x, y });
            }
        }
        this.func = func;
        let returned = this.func(arr, positions, dx, dy);
        arr = returned[0];
        returned.splice(0, 1);
        for (var i = 0; i <= width; i++) {
            let x = ax + dx * i;
            for (var j = 0; j <= height; j++) {
                let y = ay + dy * j;
                this.set(x, y, arr[i + j]);
            }
        }
        return returned;
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
                this.cell(x, y, value);
            }
        }
    }
    cell(x, y, val, pad = this.MIN_PADDING) {
        if (val < 0) {
            val = 0;
        }
        //console.log(val, colors[val]);
        fill(colors[val]);
        rect(x + pad, y + pad, this.cellwidth - pad * 2, this.cellheight - pad * 2);
        if (val == 0) return;
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
    //console.log(arr);
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