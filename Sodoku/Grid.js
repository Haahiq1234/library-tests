class Grid extends Array2D {
    constructor() {
        super(9, 9);
        const grid = this;
        on.start.bind(() => grid.start());
        on.mousedown.bind((x, y) => grid.mousedown(x, y));
        this.done = false;
    }
    start() {
        this.cell_width = CanvasWidth / 9;
        this.cell_height = CanvasHeight / 9;

        this.big_cell_width = CanvasWidth / 3;
        this.big_cell_height = CanvasHeight / 3;

        this.setEach(function (i, j) {
            return new Cell(i, j, this);
        });
    }
    mousedown(x, y) {
        // let i = floorDiv(x, this.cell_width);
        // let j = floorDiv(y, this.cell_height);
        // console.log(i, j);
        // if (i >= 0 && j >= 0 && i < 9 && j < 9) {
        //     let cell = this.get(i, j);
        //     this.collapse(cell, cell.random_val());
        // }
        this.collapseFirst();
    }
    collapse(cell, val) {
        cell.collapse(val);
        let qi = floor(cell.i, 3);
        let qj = floor(cell.j, 3);
        for (let i = qi; i < (qi + 3); i++) {
            for (let j = qj; j < (qj + 3); j++) {
                if (this.get(i, j).remove(val, cell)) {
                    return;
                }
            }
        }
        for (let k = 0; k < 9; k++) {
            if (this.get(cell.i, k).remove(val, cell) || this.get(k, cell.j).remove(val, cell)) {
                return;
            }

        }

    }
    collapseFirst() {
        if (this.done) {
            return;
        }
        let arr = [...this.array].filter((v) => !v.collapsed);
        arr = arr.sort((a, b) => a.options.length - b.options.length);
        //console.log(arr);
        if (arr.length == 0) {
            console.log("Fully done");
            this.checkForMistake();
            noLoop();
            return;
        }
        let first = arr[0];
        //console.log(first);
        this.collapse(first, first.random_val());
    }
    checkForMistake() {
        let anyerror = false;
        for (let i = 0; i < 9; i++) {
            let verticalCheck = 0b111111111;
            let horizontalCheck = 0b111111111;

            for (let j = 0; j < 9; j++) {
                verticalCheck -= 2 ** (this.get(i, j).value - 1);
                horizontalCheck -= 2 ** (this.get(j, i).value - 1);
            }
            if (verticalCheck != 0) {
                console.log("Error in Column ", i);
                anyerror = true;
            }
            if (horizontalCheck != 0) {
                console.log("Error in Row ", i);
                anyerror = true;
            }
        }
        for (let qi = 0; qi < 9; qi += 3) {
            for (let qj = 0; qj < 9; qj += 3) {
                let check = 0b111111111;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        check -= 2 ** (this.get(qi + i, qj + j).value - 1);
                    }
                }
                if (check != 0) {
                    console.log(`Error in chunk (${qi / 3}, ${qj / 3})`);
                    anyerror = true;
                }
            }
        }
        if (!anyerror) {
            console.log("There is no error");
        }
    }
    draw() {
        nofill();
        lineWidth(1);
        stroke(150);
        this.forEach(function (i, j, val) {
            val.draw();
        });
        lineWidth(3);
        stroke(0);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                rect(i * this.big_cell_width, j * this.big_cell_height, this.big_cell_width, this.big_cell_height);
            }
        }
    }
}