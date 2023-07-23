const grid = new Grid(4, 4);
function setUp() {
    if (IsMobile()) {
        createCanvas(innerWidth, innerWidth);
    } else {
        createCanvas(400, 400);
    }
    frameRate(60);

    console.log(grid);
    noLoop();
    let length = min(CanvasWidth, CanvasHeight) / 4;
    addSlideEvent(function (dir) {
        switch (dir) {
            case SLIDE_DIRECTION.UP:
                grid.move(1, 0);
                break;
            case SLIDE_DIRECTION.DOWN:
                grid.move(1, grid.height - 1);
                break;
            case SLIDE_DIRECTION.LEFT:
                grid.move(0, 0);
                break;
            case SLIDE_DIRECTION.RIGHT:
                grid.move(0, grid.height - 1);
                break;
        }
    }, length);
}
function draw() {
    grid.draw();
}
on.keydown.bind(function () {
    if (keyCode == key.down) {
        grid.move(1, grid.height - 1);
    } else if (keyCode == key.up) {
        grid.move(1, 0);
    } else if (keyCode == key.left) {
        grid.move(0, 0);
    } else if (keyCode == key.right) {
        grid.move(0, grid.width - 1);
    }
});