///<reference path="../Canvas.js"/>
///<reference path="../Animator.js"/>

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

const SLIDE_DURATION = 10;
const COMBINING_DURATION = 40;
const APPEARANCE_DURATION = 10;

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
        this.animating = false;
        this.queue = [];

        this.moveId = 0;
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
        console.log(pos);
        this.set(pos.x, pos.y, choice);

        // this.animating = true;
        // let anim = new AnimationHandler(0, APPEARANCE_DURATION,
        //     function (t) {

        //     },
        //     function () {
        //         this.set(pos.x, pos.y, choice);
        //         this.animating = false;

        //     });
    }
    slide(arr, positions) {
        let slidingOrder = getSortingOrder(arr, slidingZero);
        let toAnimate = [];
        //console.log(slidingOrder);
        let temporaryArray = [];
        let finalArr = [];
        //let finalPositions = [];
        for (let i = 0; i < slidingOrder.length; i++) {
            let orderedI = slidingOrder[i];
            let orderedIVal = arr[orderedI];
            if (orderedI != i && orderedIVal != 0) { // chekcing if the order has changed and discarding if it is a zero that has changed
                //console.log(orderedI, positions[i], positions[orderedI]);
                let startPosition = positions[orderedI]; // ordered I tells what is supposed to be at that position
                let endPosition = positions[i];
                toAnimate.push([startPosition, endPosition, orderedIVal]);
                temporaryArray[i] = -2;
            } else { // In all other cases there will be no change to the array
                temporaryArray[i] = orderedIVal;
            }
            finalArr[i] = orderedIVal;
        }
        return [temporaryArray, finalArr, toAnimate];
    }
    animateSlidingElements(toAnimate, endFunction = () => { }) {
        if (toAnimate.length > 0) {

            let grid = this;
            for (let i = 0; i < toAnimate.length; i++) {
                //this.set(toAnimate[i][1].x, toAnimate[i][1].y, 0);
                this.set(toAnimate[i][0].x, toAnimate[i][0].y, 0);
            }
            let anim = new AnimationHandler(
                undefined, SLIDE_DURATION,
                function (t) {
                    for (let i = 0; i < toAnimate.length; i++) {
                        grid.cell(
                            (toAnimate[i][0].x * (1 - t) + toAnimate[i][1].x * t) * grid.cellwidth,
                            (toAnimate[i][0].y * (1 - t) + toAnimate[i][1].y * t) * grid.cellheight,
                            toAnimate[i][2]
                        );
                    }
                },
                function () {
                    for (let i = 0; i < toAnimate.length; i++) {
                        grid.cell(
                            toAnimate[i][1].x * grid.cellwidth,
                            toAnimate[i][1].y * grid.cellheight,
                            toAnimate[i][2]
                        );
                        grid.set(toAnimate[i][1].x, toAnimate[i][1].y, toAnimate[i][2]);
                    }
                    endFunction();
                });
            anim.run();
            this.slidingAnim = anim;
        } else {
            endFunction();
        }
    }

    COMBINE_PADDING_MAX = 0;
    COMBINE_PADDING_MIN = 5;
    animateCombiningElements(toCombine, endFunction = () => { }) {
        for (let i = 0; i < toCombine.length; i++) {
            //console.log(toCombine[i]);
            this.set(toCombine[i][0].x, toCombine[i][0].y, 0);
            this.set(toCombine[i][1].x, toCombine[i][1].y, 0);
            //  this.set(toCombine[i][1].x, toCombine[i][1].y, toCombine[i][2]);
        }
        //endFunction();

        //return;
        let grid = this;
        if (toCombine.length > 0) {
            this.combiningAnim = new AnimationHandler([], SLIDE_DURATION,
                function (t) {
                    for (let i = 0; i < toCombine.length; i++) {
                        let cell = toCombine[i];
                        grid.cell(
                            (cell[0].x * (1 - t) + cell[1].x * t) * grid.cellwidth,
                            (cell[0].y * (1 - t) + cell[1].y * t) * grid.cellheight,
                            cell[2] - 1,
                            grid.MIN_PADDING + grid.MAX_PADDING / 3 * t);
                        if (t < 0.5) {
                            grid.cell(
                                cell[1].x * grid.cellwidth,
                                cell[1].y * grid.cellheight,
                                cell[2] - 1,
                                grid.COMBINE_PADDING_MIN * (1 - t * 2) - grid.COMBINE_PADDING_MAX * t * 2);

                        } else {
                            grid.cell(
                                cell[1].x * grid.cellwidth,
                                cell[1].y * grid.cellheight,
                                cell[2],
                                grid.COMBINE_PADDING_MIN * (2 * t - 1) - grid.COMBINE_PADDING_MAX * (2 * t));

                        }
                    }
                },
                function () {
                    for (let i = 0; i < toCombine.length; i++) {
                        let cell = toCombine[i];
                        grid.cell(
                            cell[1].x * grid.cellwidth,
                            cell[1].y * grid.cellheight,
                            cell[2]);
                        //grid.set(toCombine[i][1].x, toCombine[i][1].y, toCombine[i][2]);
                        grid.set(cell[1].x, cell[1].y, cell[2]);

                    }
                    endFunction();
                });
            this.combiningAnim.run();
        } else {
            endFunction();
        }

    }
    combine(arr, positions, arr2) {
        let toCombine = [];
        for (var i = 0; i < arr.length - 1; i++) {
            if (arr[i] == arr[i + 1] && arr[i] > 0) {
                arr[i] = arr[i] + 1;
                arr[i + 1] = 0;

                if (arr2) {
                    arr2[i] = arr2[i] + 1;
                    arr2[i + 1] = 0;
                }

                //console.log(positions[i + 1], positions[i], arr[i]);
                toCombine.push([positions[i + 1], positions[i], arr[i], i]);
            }
        }
        return [arr, toCombine, arr2];
    }
    get IsAnimating() {
        return (this.slidingAnim && this.slidingAnim.isRunning) || (this.combiningAnim && this.combiningAnim.isRunning);
    }
    animateMovePhase1(toSlideStart, toCombineStart, toCombineEnd, toSlideEnd, emptySpaces) {
        let grid = this;
        this.moveId++;
        //this.phase1Complete = false;
        if (toSlideStart.length > 0) {
            this.animateSlidingElements(toSlideStart, function () {
                if (!grid.IsAnimating) {
                    grid.animateMovePhase2(toCombineEnd, toSlideEnd, emptySpaces);
                }
            });
            //console.table(toSlideStart);
        } else if (toCombineStart.length == 0) {
            this.animateMovePhase2(toCombineEnd, toSlideEnd, emptySpaces);
            return;
        }
        if (toCombineStart.length > 0) {
            this.animateCombiningElements(toCombineStart, function () {
                if (!grid.IsAnimating) {
                    //console.log("Not Animating");
                    grid.animateMovePhase2(toCombineEnd, toSlideEnd, emptySpaces);
                }
            });
        }
    }
    animateMovePhase2(toCombineEnd, toSlideEnd, emptySpaces) {
        //console.log(this.moveId);
        //console.log(toCombineEnd);
        let grid = this;
        this.animateCombiningElements(toCombineEnd, function () {
            grid.animateSlidingElements(toSlideEnd, function () {
                grid.endMove(emptySpaces);
            });
            //grid.endMove(emptySpaces);
        });
    }
    endMove(emptySpaces) {
        grid.addRandom(emptySpaces);
        if (grid.queue.length > 0) {
            let move = grid.queue.shift();
            grid.move(move[0], move[1]);
        }
    }
    move(dimension, start) {
        if (this.IsAnimating) {
            this.queue.push([dimension, start]);
            console.log(dimension);
            return;
        }
        let toSlideStart = [];
        let toCombineStart = [];
        let toCombineEnd = [];
        let toSlideEnd = [];

        //let toSlideEnd = [];
        let emptySpaces = [];
        let grid = this;
        this.operate(dimension, start, function (arr, positions) {
            let [temporaryArray, finalArr, toAnimateSliding] = grid.slide(arr, positions);
            toSlideStart = toSlideStart.concat(toAnimateSliding);
            //const toReturn = [...finalArr];
            let toAnimateCombining;
            [temporaryArray, toAnimateCombining, finalArr] = grid.combine(temporaryArray, positions, finalArr);
            toCombineStart = toCombineStart.concat(toAnimateCombining);

            for (let i = 0; i < toAnimateCombining.length; i++) {
                finalArr[toAnimateCombining[i][3]] = 0;
                finalArr[toAnimateCombining[i][3] + 1] = 0;
            }
            let toAnimateCombiningEnd;
            [finalArr, toAnimateCombiningEnd] = grid.combine(finalArr, positions);
            toCombineEnd = toCombineEnd.concat(toAnimateCombiningEnd);

            for (let i = 0; i < toAnimateCombining.length; i++) {
                finalArr[toAnimateCombining[i][3]] = toAnimateCombining[i][2];
                finalArr[toAnimateCombining[i][3] + 1] = 0;
            }

            [temporaryArray, finalArr, toAnimateSliding] = grid.slide(finalArr, positions);
            toSlideEnd = toSlideEnd.concat(toAnimateSliding);
            //console.log(finalArr, temporaryArray);
            for (let i = 0; i < finalArr.length; i++) {
                if (finalArr[i] == 0) {
                    emptySpaces.push(positions[i]);
                }
            }
            return [arr];
        });
        //console.log(emptySpaces);
        this.animateMovePhase1(toSlideStart, toCombineStart, toCombineEnd, toSlideEnd, emptySpaces);
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
        // let dec = val % 1;
        // val = floor(val);
        // if (dec > 0 && val < colors.length - 1) {
        //     fill(Rgb.weighted(colors[val], 1 - dec, colors[val + 1], dec));
        // } else {
        fill(colors[val]);
        // }
        //console.log(val, colors[val]);
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