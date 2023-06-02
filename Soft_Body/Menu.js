class Menu {
    constructor() {
        this.enabled = true;
        this.sliders = [];
    }
    init() {
        this.closeButton = new Button(CanvasWidth / 2, CanvasHeight - 50, CanvasWidth / 4, 40);
        this.closeButton.text("Start", 20);
        var menu = this;
        this.closeButton.bind("click", () => menu.close());
        

        let xwidth = 75;
        let x = (CanvasWidth - xwidth * 5) / 2;
        this.distanceBetweenSliders = xwidth;
        this.x = x;

        this.ks = new Slider(x, 300, x, 100, 0, 2, 0.99, color(255, 0, 0));
        this.ks.text(slider => "" + slider.value(100), 10);
        this.ks.name("ks", 15, 0, 20);

        this.kd = new Slider(x + xwidth, 300, x + xwidth, 100, 0, 2, 1, color(255, 0, 0));
        this.kd.text(slider => "" + slider.value(100), 10);
        this.kd.name("kd", 15, 0, 20);

        this.radius = new Slider(x + xwidth * 2, 300, x + xwidth * 2, 100, 0, 25, 10, color(255, 0, 0));
        this.radius.text(slider => "" + slider.value(1), 10);
        this.radius.name("Radius", 15, 0, 20);

        this.distanceBetweenPoints = new Slider(x + xwidth * 3, 300, x + xwidth * 3, 100, 0, 200, 50, color(255, 0, 0));
        this.distanceBetweenPoints.text(slider => "" + slider.value(1), 10);
        this.distanceBetweenPoints.name("Distance", 15, 0, 20);

        this.width = new Slider(x + xwidth * 4, 300, x + xwidth * 4, 100, 0, 1.01, 1, color(255, 0, 0));
        this.width.text(slider => "" + floor(menu.currentMaximumWidth * slider.value() + 1), 10);
        this.width.name("Width", 15, 0, 20);

        this.height = new Slider(x + xwidth * 5, 300, x + xwidth * 5, 100, 0, 1.01, 0.9334, color(255, 0, 0));
        this.height.text(slider => "" + floor(menu.currentMaximumHeight * slider.value() + 1), 10);
        this.height.name("Height", 15, 0, 20);
    }
    getMaximumSize() {
        let distanceBetweenPoints = this.distanceBetweenPoints.value(1);
        let radius = this.radius.value();
        let width = floorDiv(CanvasWidth - radius * 2 - softBody.x, distanceBetweenPoints);
        let height = floorDiv(CanvasHeight - radius * 2 - softBody.y, distanceBetweenPoints);
        this.currentMaximumWidth = width;
        this.currentMaximumHeight = height;
    }
    update() {
        this.getMaximumSize();
    }
    close() {
        this.enabled = false;       
        fill(255, 0, 0);
        let width = floor(this.currentMaximumWidth * this.width.value() + 1)
        let height = floor(this.currentMaximumHeight * this.height.value() + 1)

        softBody.generate(width, height, this.distanceBetweenPoints.value(1), this.ks.value(100), this.kd.value(100), new Vector2(0, 2), this.radius.value(1)); 
        UI.Clear();
    }
}