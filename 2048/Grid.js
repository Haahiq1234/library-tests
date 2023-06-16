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
        this.addRandom();
        let graph = this;
        on.start.bind(() => graph.init());
    }
    init() {
        this.cellwidth = CanvasWidth / this.width;
        this.cellheight = CanvasHeight / this.height;
        noStroke();
    }
    swipeDown() {
        for (let i = 0; i < this.width; i++) {
            this.setCol(operate(this.getCol(i).reverse()).reverse(), i);
        }
        let possibilities = this.getPossibilities();
        this.addRandom(possibilities);
    }
    swipeUp() {
        for (let i = 0; i < this.width; i++) {
            this.setCol(operate(this.getCol(i)), i);
        }
        let possibilities = this.getPossibilities();
        this.addRandom(possibilities);
    }
    swipeLeft() {
        for (let j = 0; j < this.width; j++) {
            this.setRow(operate(this.getRow(j)), j);
        }
        let possibilities = this.getPossibilities();
        this.addRandom(possibilities);
    }
    swipeRight() {
        for (let j = 0; j < this.width; j++) {            
            this.setRow(operate(this.getRow(j).reverse()).reverse(), j);
        }
        let possibilities = this.getPossibilities();
        this.addRandom(possibilities);
    }
    addRandom(possibilities=this.getPossibilities()) {
        let choice = Random.element(this.choices);
        let pos = Random.element(possibilities);
        this.set(pos.x, pos.y, choice);
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
    return arr.sort((a, b) => (b==0)? -1 : 1);
}
function combine(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i] == arr[i + 1] && arr[i] > 0) {
            arr[i]++;
            arr[i + 1] = 0;
        }
    }
}