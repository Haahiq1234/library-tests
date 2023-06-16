class Grid extends Array2D {
    snake;
    constructor(width, height) {
        super(width, height);
        var grid = this;
        on.start.bind(() => grid.start());
        on.keydown.bind(() => grid.keydown());
    }
    start() {
        this.cellwidth = CanvasWidth / this.width;
        this.cellheight = CanvasHeight / this.height;
    }
    keydown() {
        // let snake = this.snake;
        // if (keyCode == key.up && snake.vely == 0) {
        //     snake.velx = 0;
        //     snake.vely = -1;
        // } else if (keyCode == key.down && snake.vely == 0) {
        //     snake.velx = 0;
        //     snake.vely = 1;
        // } else if (keyCode == key.right && snake.velx == 0) {
        //     snake.velx = 1;
        //     snake.vely = 0;
        // } else if (keyCode == key.left && snake.velx == 0) {
        //     snake.velx = -1;
        //     snake.vely = 0;
        // }
    }
    IsValid(x, y) {
        return (x >= 0 && y >= 0 && x < this.width && y < this.width && this.get(x, y) < 2);
    }
    setSnake(x, y, colA, colB) {
        this.snake = new Snake(x, y, colA, colB);
        this.snake.init(this);
    }
    update() {
        this.array.fill(0);
        this.snake.update();
    }
    draw() {
        this.snake.draw();
    }
    end() {
        alert("Gameover!");
        noLoop();
    }
}