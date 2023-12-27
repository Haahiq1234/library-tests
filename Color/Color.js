///<reference path="../Canvas.js"/>

class ColorHandler {
    constructor() {

    }
    init() {
        this.rs = new Slider(100, 100, 100, 300, 0, 255, 255);
        this.gs = new Slider(200, 100, 200, 300, 0, 255, 0);
        this.bs = new Slider(300, 100, 300, 300, 0, 255, 0);

        this.rs.name(silder => silder.value(1), 20, 0, -25);
        this.gs.name(silder => silder.value(1), 20, 0, -25);
        this.bs.name(silder => silder.value(1), 20, 0, -25);

        const handler = this;

        this.copyButton = new Button(375, 375, 50, 50, color(255));
        this.copyButton.text("Copy", 15, color(0));
        this.copyButton.bind("click", function () {
            let r = handler.rs.value(1);
            let g = handler.gs.value(1);
            let b = handler.bs.value(1);
            navigator.clipboard.writeText(`rgb(${r},${g},${b})`);
        });
    }
    update() {
        let col = color(this.rs.value(1), this.gs.value(1), this.bs.value(1));
        fill(col);
        rect(0, 0, CanvasWidth, CanvasHeight);
        fill(invertColor(col));
        textSize(30);
        text("Inverted Color", 200, 350);
    }
}