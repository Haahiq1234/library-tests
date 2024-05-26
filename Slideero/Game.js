const GameState = {
    in_main_menu: 0,
    in_game: 1,
};


class Game {
    constructor() {
        this.main_menu = new Menu();
        this.grid = new Grid(2, 2);
        this.state = GameState.in_main_menu;

        const game = this;
        on.pointerdown.bind(function (x, y) { game.on_pointer_down(x, y) });
        on.pointerup.bind(function (x, y, px, py) { game.on_pointer_up(x, y, px, py) });
    }
    update() {
        if (this.state == GameState.in_main_menu) {
            this.main_menu.update();
        } else if (this.state == GameState.in_game) {
            this.grid.update();
        }
    }
    on_pointer_down(x, y) {
        if (this.state == GameState.in_game) {
            this.grid.onpointerdown(x, y);
        } else if (this.state == GameState.in_main_menu) {
            this.main_menu.on_pointer_down(x, y);
        }
    }
    on_pointer_up(x, y, px, py) {
        if (this.state == GameState.in_main_menu) {
            this.main_menu.on_pointer_up(x, y, px, py);
        }
    }
    open_main_menu() {
        this.state = GameState.in_main_menu;
        this.main_menu.open();
    }
    set_grid_design(im) {
        this.grid.image = im;
    }
    draw_grid_preview(width, height) {
        this.grid.preview(width, height);
    }
    begin_game() {
        this.state = GameState.in_game;
        this.grid.begin();
    }
}