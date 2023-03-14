class TextBox extends UIElement {
    hoveredColor = color(255, 0, 0);
    constructor(x, y, w, h, col = color(0, 255, 0)) {
        super(x, y, UI.RECT, w, h);
        this.baseColor = col;
    }
    update() {
        super.update();
        this.color = this.baseColor;
        if (this.hovered) {
            this.color = this.hoveredColor;
        }
    }
}