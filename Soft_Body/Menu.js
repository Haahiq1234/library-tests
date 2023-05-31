class Menu {
    constructor() {
        this.enabled = true;
    }
    init() {
        this.closeButton = new Button(CanvasWidth / 2, CanvasHeight - 50, CanvasWidth / 4, 50);
        this.closeButton.name("Generate", 20);
        var menu = this;
        this.closeButton.bind("click", function() {
            menu.close();
        });
        this.ks = new Slider(100, 300, 100, 100, 0, 1, 0.99, color(255, 0, 0));
        this.ks.name(function(slider) {
            return "" + Math.floor(slider.value() * 100) / 100;
        }, 10);
        this.kd = new Slider(200, 300, 200, 100, 0, 1, 1, color(255, 0, 0));
        this.kd.name(function(slider) {
            return "" + slider.value(100);
        }, 20);
        this.radius = new Slider(300, 300, 300, 100, 0, 25, 10, color(255, 0, 0));
        this.radius.name(function(slider) {
            return "" + slider.value(1);
        }, 20);
    }
    update() {
        fill(0);
        textSize(15);
        text("ks", 100, 320);
        text("kd", 200, 320);
        text("Radius", 300, 320);
    }
    close() {
        this.enabled = false;       
        fill(255, 0, 0);
        softBody.generate(11, 6, 50, this.ks.value(100), this.kd.value(100), new Vector2(0, 2), this.radius.value(1)); 
        this.closeButton.Destroy();
        this.ks.Destroy();
        this.kd.Destroy();
        this.radius.Destroy();
    }
}