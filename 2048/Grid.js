class Grid extends Array2D {
    padding = 5;
    backGroundColor = "rgb(189, 177, 165)";
    choices = [
        1, 2, 3
    ];
    colors = [
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
    constructor(width, height) {
        super(width, height);
        this.positions = new Array2D(width, height);
        this.addRandom();
        let graph = this;
        on.start.bind(() => graph.init());
    }
    resetPosition(i, j) {
        this.positions.set(i, j, new Vector2(i * this.cellwidth, j * this.cellheight));
    }
    init() {
        this.cellwidth = CanvasWidth / this.width;
        this.cellheight = CanvasHeight / this.height;
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                this.resetPosition(i, j);
            }
        }
        noStroke();
    }
    addRandom(possibilities = this.getPossibilities()) {
        let choice = Random.element(this.choices);
        let pos = Random.element(possibilities);
        this.set(pos.x, pos.y, choice);
    }
    operate(dimension, f) {
        let len = this.getDimensionSize(1 - dimension);
        console.log(len);
        for (var i = 0; i < len; i++) {
            this.setDimensionArr(dimension, i, f(operate(f(this.getDimensionArr(dimension, i)))));
        }
        let possibilities = this.getPossibilities();
        this.addRandom(possibilities);
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
                //console.log(i, j);
                let x = i * this.cellwidth;
                let y = j * this.cellheight;
                let value = this.get(i, j);
                fill(this.colors[value]);
                rect(x + this.padding, y + this.padding, this.cellwidth - this.padding * 2, this.cellheight - this.padding * 2);
                if (value > 0) {
                    let str = (2 ** value).toString();
                    let digits = str.length - 1;
                    fill(0);
                    textSize(45 - digits * 5);
                    text(str, x + this.cellwidth / 2, y + this.cellheight / 2);
                }
            }
        }
    }
    checkGameState() {
        alert("game Ended");
    }
}
function operate(arr) {
    slide(arr);
    combine(arr);
    slide(arr);
    return arr;
}
function slide(arr) {
    let order = getSortingOrder(arr, sortingFunction);
    arr.sort(sortingFunction);
    //console.log(arr);
    return order;
}
function sortingFunction(a, b) {
    let condition = (b == 0);
    if (condition && a == 0) return 0;
    return condition ? -1 : 1;
}
function combine(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i] == arr[i + 1] && arr[i] > 0) {
            arr[i]++;
            arr[i + 1] = 0;
        }
    }
}
function getSortingOrder(arr, f) {
    let order = [];
    for (var i = 0; i < arr.length; i++) {
        order.push(i);
    }
    order.sort((a, b) => f(arr[a], arr[b]));
    return order;
}