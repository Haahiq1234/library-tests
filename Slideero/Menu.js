///<reference path="../Canvas.js"/>

UI.DEFAULT_RADIUS = 30;

const FRAMES_PER_FULL_CHANGE = 10;

class Game {
    running = false;
    constructor() {
        let game = this;
        this.images = [undefined, loadImage("../kitten.jpg"), loadImage("sliding_1.jpg")];
        this.grid = new Grid(2, 2);
        on.start.bind(() => game.init());
        this.start = new Button(0, 0, 70, 70, color(150));
        this.start.text("Start", 20);
        this.start.bind("click", () => game.closeMenu());
        //on.keydown.bind((code) => game.keydown(code));

        // addSlideEvent(function(dir) {
        //     switch (dir) {
        //       case SLIDE_DIRECTION.RIGHT:
        //         game.keydown(key.right);
        //         break;
        //       case SLIDE_DIRECTION.LEFT:
        //         game.keydown(key.left);
        //         break;
        //     }
        // }, 100);

        this.current = 0;
        this.next = 0;
        this.isMousePressed = false;
        this.mousePressedX = 0;
        this.previousDx = 0;
        this.speedDX = 0;
        this.inAnimationMode = false;
        on.pointerdown.bind(function (x, y) {
            if (!game.running) {
                game.isMousePressed = true;
                game.mousePressedX = x;
                game.previousDx = 0;
            }
        });
        this.dx = 0;
        on.pointerup.bind(function (x, y, px, py) {
            game.onpointerup(x, y, px, py);
        });
    }
    onpointerup(x, y, px, py) {
        this.isMousePressed = false;
        let dx = x - px;
        let signDx = sign(dx);
        let nextI = -signDx + this.current;
        if (this.FrameExists(nextI)) {
            if (abs(dx) > CanvasWidth / 2) {
                this.dx = dx;
                if (dx < 0) {
                    this.keydown(key.left);
                } else {
                    this.keydown(key.right);
                }
                this.dx = 0;
            } else {
                let reverseDX = -signDx * CanvasWidth + dx;
                this.dx = reverseDX;
                this.current = nextI;
                if (dx < 0) {
                    this.keydown(key.right);
                } else {
                    this.keydown(key.left);
                }
                this.dx = 0;
            }
        }
    }
    closeMenu() {
        UI.Disable();
        this.running = true;
        this.grid.image = this.images[this.next];
        this.grid.begin();
    }
    update() {
        if (!this.inAnimationMode) {
            if (this.running) {
                this.grid.draw();
            } else {
                let size = this.size.value(1);
                if (this.isMousePressed) {
                    let dx = Mouse.x - this.mousePressedX;
                    let signDx = sign(dx);
                    let nextCurrent = -signDx + this.current;
                    //console.log(nextCurrent);
                    if (this.FrameExists(nextCurrent)) {
                        //this.grid.image = this.images[current];
                        //line(this.mousePressedX, 200, Mouse.x, 200);
                        push();
                        translate(dx, 0);
                        this.grid.preview(size, size);
                        translate(CanvasWidth * -signDx, 0);
                        this.grid.image = this.images[nextCurrent];
                        this.grid.preview(size, size);
                        pop();
                        this.grid.image = this.images[this.current];
                    } else {
                        this.grid.preview(size, size);
                    }

                } else {
                    this.grid.preview(size, size);
                }
            }
        }
        // fill(255);
        // rect(
        //     this.size.nameoffsetx + this.size.a.x - 30,
        //     this.size.nameoffsety + this.size.a.y - 20,
        //     60,
        //     40);

    }
    FrameExists(i) {
        return i < this.images.length && i >= 0;
    }
    init() {
        this.start.localPosition.set(35, CanvasWidth - 35);

        //this.size = new Slider(35, CanvasHeight / 4 * 3 - 50, 35, CanvasHeight / 4 - 50, 2, 6, 4, color(150));
        this.size = new Slider(CanvasWidth - 100, CanvasHeight - 35, 120, CanvasHeight - 35, 6, 2, 4, color(150));
        this.size.text((sld) => sld.value(1), 20, 65, 0);
        //this.size.name("Size", 20, 0, 40);
        //this.size.text((sld) => sld.value(1), 30);
    }
    keydown(keyCode) {
        if (this.running) return;
        let sn = (keyCode == key.left) ? 1 : (keyCode == key.right ? -1 : 0);
        let nextI = this.current + sn;
        if (this.FrameExists(nextI) && nextI != this.current) {
            // console.log(nextI);
            this.inAnimationMode = true;
            let frameMoved = this.dx / CanvasWidth;
            let frameDuration = FRAMES_PER_FULL_CHANGE * (1 - abs(frameMoved) * 0.5);
            console.log(frameDuration);
            let game = this;
            let size = this.size.value(1);
            let current = this.current;
            let dx = this.dx;
            let signDx = (abs(dx) > 0) ? sign(dx) : nextI - this.current;
            console.log(signDx, dx);
            let animation = new AnimationHandler(
                [],
                frameDuration,
                function (t) {
                    translate(dx);
                    push();
                    let toTranslate = dx * (1 - t) + signDx * CanvasWidth * t;
                    //console.log(t, toTranslate);
                    translate(toTranslate, 0);
                    game.grid.image = game.images[current];
                    game.grid.preview(size, size);
                    translate(CanvasWidth * -signDx, 0);
                    game.grid.image = game.images[nextI];
                    game.grid.preview(size, size);
                    pop();
                },
                function () {
                    game.inAnimationMode = false;

                    game.grid.preview(size, size);
                    game.current = nextI;
                });
            animation.run();
            this.next = nextI;
        }
        this.previewGrid();
    }
    previewGrid() {
        this.grid.image = this.images[this.current];
    }
    openMenu() {
        UI.Enable();
        game.running = false;
    }
}
