UI.DEFAULT_RADIUS = 30;


class Game {
    enabled = false;
    constructor() {
        let game = this;
        this.grid = new Grid(2, 2, loadImage("../kitten.jpg"));
        on.start.bind(() => game.init());
        this.start = new Button(0, 0, 100, 50, color(150));
        this.start.text("Start", 20);
        this.start.bind("click", () => game.closeMenu());
    }
    closeMenu() {
            UI.Disable();
            this.enabled = true;
            this.grid.begin();

    }
    update() {
        if (this.enabled) {
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
        this.start.localPosition.set(50, CanvasWidth - 25);

        this.size = new Slider(CanvasWidth / 2, CanvasHeight / 4 * 3, CanvasWidth / 2, CanvasHeight / 4, 2, 6, 4, color(150));
        this.size.name("Size", 20, 0, 60);
        this.size.text((sld)=>sld.value(1), 30);
    }
    openMenu() {
        UI.Enable();
        game.enabled = false;
    }
}
