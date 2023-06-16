class test1 {
    constructor() {
        
    }
    init() {
        this.rs = new Slider(100, 100, 100, 300, 0, 255, 255);
        this.gs = new Slider(200, 100, 200, 300, 0, 255, 0);
        this.bs = new Slider(300, 100, 300, 300, 0, 255, 0);

        this.rs.text(silder=>silder.value(1));
        this.gs.text(silder=>silder.value(1));
        this.bs.text(silder=>silder.value(1));
    }
    update() {
        let col = color(this.rs.value(1), this.gs.value(1), this.bs.value(1));
        fill(col);
        rect(0, 0, CanvasWidth, CanvasHeight);
        fill(invertColor(col));
        text("Text", 200, 350);
    }
}