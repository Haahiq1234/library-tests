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
    operate(dimension, f, start) {
        this.added = false;
        this.slide(dimension, f, start, true);
        //this.combine(dimension, f);
        //this.slide(dimension, f);
    }
    slide(dimension, f, start, first) {
        let len = this.getDimensionSize(dimension);
        let toAnimate = [];
        for (var i = 0; i < len; i++) {
            let parr = f(this.getDimensionArr(dimension, i));
            let arr = new Array(parr.length).fill(0);
            let order = getSortingOrder(parr, slidingZero);
            for (var j = 0; j < order.length; j++) {
                if (order[j] == j) {
                    arr[j] = parr[j];
                } else if (parr[order[j]] != 0) {
                    let axp = i;
                    let ayp = abs(start - order[j]);
                    let bxp = i;
                    let byp = abs(start - j)
                    const [ax, ay] = [dimension == 0? axp: ayp, dimension == 0? ayp: axp]
                    const [bx, by] = [dimension == 0? bxp: byp, dimension == 0? byp: bxp]
                    
                    console.log(ax, ay, bx, by);
                    toAnimate.push([ax, ay, bx, by, parr[order[j]]]);
                    arr[j] = parr[order[j]];
                }
            }
            arr.sort(slidingZero);
            this.setDimensionArr(dimension, i, f(arr));
        }
            const grid = this;
            if (toAnimate.length > 0 && false) {
                animate(0, MOVE_DURATION, function(t) {
                    for (var animation of toAnimate) {
                        grid.cell(
                            (animation[0] * (1 - t) + animation[2] * t) * grid.cellwidth, 
                            (animation[1] * (1 - t) + animation[3] * t) * grid.cellheight, 
                            animation[4],
                            );
                    }
                }, function() {
                    for (var animation of toAnimate) {
                        grid.set(animation[2], animation[3], animation[4]);
                    }
                    if (first) {
                        grid.combine(dimension, f, start);
                    } else {
                        grid.addRandom();
                    }
                });
            } else if (first) {
                this.combine(dimension, f, start);
            } else {
                grid.addRandom();
            }
    }
    combine(dimension, f, start) {
        console.trace("combining");
        let len = this.getDimensionSize(1 - dimension);
        for (var i = 0; i < len; i++) {
            let toGet = this.getDimensionArr(dimension, i);
            this.setDimensionArr(dimension, i, f(combine(f(toGet))));
        }
        this.slide(dimension, f, start, false);
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