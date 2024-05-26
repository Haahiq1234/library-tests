///<reference path="../Canvas.js"/>

const FRAMES_PER_FULL_CHANGE = 10;

class Menu {
    running = false;
    constructor() {
        let menu = this;
        this.images = [undefined, loadImage("../kitten.jpg"), loadImage("sliding_1.jpg")];
        this.start = new Button(0, 0, 60, 60, color(150));
        this.start.text("Start", 20);
        this.start.bind("click", () => menu.close_menu());

        this.current = 0;
        this.next = 0;
        this.is_mouse_pressed = false;
        this.mouse_pressed_x = 0;
        this.dx = 0;

        on.start.bind(() => menu.init());
    }
    on_pointer_down(x, y) {
        this.is_mouse_pressed = true;
        this.mouse_pressed_x = x;
    }
    on_pointer_up(x, y, px, py) {
        console.log(x, y, px, py);
        this.is_mouse_pressed = false;
        let dx = x - px;
        let signDx = sign(dx);
        if (abs(dx) > CanvasWidth) {
            dx = CanvasWidth * signDx;
        }
        let nextI = -signDx + this.current;
        if (this.frame_exists(nextI)) {
            if (abs(dx) > CanvasWidth / 2) {
                this.dx = dx;
                this.slide(-signDx);
                this.dx = 0;
            } else if (abs(dx) > 3) {
                let reverseDX = -signDx * CanvasWidth + dx;
                this.dx = reverseDX;
                this.current = nextI; // temporarily setting it so that it can slide and be set back;
                this.slide(signDx);
                this.dx = 0;
            }
        }
    }
    close_menu() {
        UI.Disable();
        this.running = true;
        game.set_grid_design(this.images[this.next]);
        game.begin_game();
    }
    update() {
        if (!(this.animation && this.animation.isRunning)) {
            let size = this.size.value(1);
            if (this.is_mouse_pressed) {
                let dx = Mouse.x - this.mouse_pressed_x;
                let signDx = sign(dx);
                if (abs(dx) > CanvasWidth) {
                    dx = CanvasWidth * signDx;
                }
                let offset = signDx;
                let nextCurrent = -(offset) + this.current;
                //console.log(nextCurrent);

                if (this.frame_exists(nextCurrent)) {
                    // if (signDx == -1) {
                    //     line(CanvasWidth, 200, CanvasWidth + dx, 200);
                    // } else {
                    //     line(0, 200, dx, 200);
                    // }
                    push();
                    translate(dx, 0);
                    game.draw_grid_preview(size, size);
                    translate(CanvasWidth * -signDx, 0);
                    game.set_grid_design(this.images[nextCurrent]);
                    game.draw_grid_preview(size, size);
                    pop();
                    game.set_grid_design(this.images[this.current]);
                } else {
                    game.draw_grid_preview(size, size);
                }
            } else {
                game.draw_grid_preview(size, size);
            }
        }

    }
    frame_exists(i) {
        return i < this.images.length && i >= 0;
    }
    init() {
        this.start.localPosition.set(CanvasWidth - 35, CanvasHeight - 35);

        this.size = new Slider(CanvasWidth - 100, CanvasHeight - 35, 120, CanvasHeight - 35, 6, 2, 4, color(150));
        this.size.text((sld) => sld.value(1), 20, 65, 0);
        this.size.setShape(UI.RECT, 50, 50);
        this.size.lineWidth = 20;
    }
    slide(slide_offset) {
        let nextI = this.current + slide_offset;
        if (this.frame_exists(nextI) && nextI != this.current) {
            this.slide_to(nextI);
            this.next = nextI;
        }
        this.set_grid_preview(this.current);
    }
    slide_to(nextI) {
        let frameMoved = this.dx / CanvasWidth;
        let frameDuration = FRAMES_PER_FULL_CHANGE * (1 - abs(frameMoved) * 0.5);
        console.log(frameDuration);
        let menu = this;
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
                menu.set_grid_preview(current);
                game.draw_grid_preview(size, size);
                translate(CanvasWidth * -signDx, 0);
                menu.set_grid_preview(nextI);
                game.draw_grid_preview(size, size);
                pop();
            },
            function () {
                game.draw_grid_preview(size, size);
                menu.current = nextI;
            });
        animation.run();
        this.animation = animation;
    }
    set_grid_preview(i) {
        game.set_grid_design(this.images[i]);
    }
    open() {
        UI.Enable();
        this.running = false;
    }
}
