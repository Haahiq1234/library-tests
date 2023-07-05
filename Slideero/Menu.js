UI.DEFAULT_RADIUS = 30;


class Game {
    enabled = true;
    constructor() {
        let game = this;
        on.start.bind(() => game.init());
        this.start = new Button(0, 0, 100, 50);
        this.start.text("Start", 20);
        this.start.bind("click", function () {
            UI.Disable();
            grid.init(game.width.value(1), game.height.value(1));
        });

    }
    init() {
        this.start.localPosition.set(50, CanvasWidth - 25);

        this.width = new Slider(CanvasWidth / 3, CanvasHeight / 4 * 3, CanvasWidth / 3, CanvasHeight / 4, 2, 7, 4);
        this.width.name("width", 20, 0, 30);
        this.width.text((sld)=>sld.value(1), 30);

        this.height = new Slider(CanvasWidth / 3 * 2, CanvasHeight / 4 * 3, CanvasWidth / 3 * 2, CanvasHeight / 4, 2, 7, 4);
        this.height.name("height", 20, 0, 30);
        this.height.text((sld)=>sld.value(1), 30);
        //this.start.Disable();
        //grid.init(grid.width, grid.height);
    }
    openMenu() {
        UI.Enable();
    }
}
