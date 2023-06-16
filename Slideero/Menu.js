class Menu {
    constructor() {
        let menu = this;
        on.start.bind(() => menu.init());
    }
    init() {
        this.start = new Button(50, CanvasWidth - 25, 100, 50);
        this.start.text("Start", 20);
        var st = this.start;
        this.start.bind("click", function () {
            console.log(st);
            st.Disable();
            grid.begin();
        });
        this.start.Disable();
        grid.begin();
    }
    open() {
        console.log("Menu Opened");
        this.start.Enable();
    }
}
