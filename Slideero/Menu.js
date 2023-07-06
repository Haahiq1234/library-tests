UI.DEFAULT_RADIUS = 30;


class Game {
    running = false;
    constructor() {
        let game = this;
        this.images = [undefined, loadImage("../kitten.jpg")];
        this.grid = new Grid(2, 2);
        on.start.bind(() => game.init());
        this.start = new Button(0, 0, 70, 70, color(150));
        this.start.text("Start", 20);
        this.start.bind("click", () => game.closeMenu());
        on.keydown.bind((code) => game.keydown(code));

        addSlideEvent(function(dir) {
            switch (dir) {
              case SLIDE_DIRECTION.RIGHT:
                game.keydown(key.right);
                break;
              case SLIDE_DIRECTION.LEFT:
                game.keydown(key.left);
                break;
            }
        }, 100);

        this.current = 0;
    }
    closeMenu() {
        UI.Disable();
        this.running = true;
        this.grid.begin();
    }
    update() {
        if (this.running) {
            this.grid.draw();
        } else {
            let size = this.size.value(1);
            this.grid.preview(size, size);
            fill(255);
            rect(
                this.size.nameoffsetx + this.size.a.x - 30, 
                this.size.nameoffsety + this.size.a.y - 20, 
                60, 
                40);
        }
    }
    init() {
        this.start.localPosition.set(35, CanvasWidth - 35);

        this.size = new Slider(35, CanvasHeight / 4 * 3 - 50, 35, CanvasHeight / 4 - 50, 2, 6, 4, color(150));
        //this.size = new Slider(150, CanvasHeight - 35, CanvasWidth - 50, CanvasHeight - 35, 2, 6, 4, color(150));
        //this.size.name("Size", 20, -40, 0);
        this.size.name("Size", 20, 0, 40);
        this.size.text((sld)=>sld.value(1), 30);
    }
    keydown(keyCode) {
        if (keyCode == key.right && this.current > 0) {
            this.current--;
        }else if (keyCode == key.left && this.current < this.images.length - 1) {
            this.current++;
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
