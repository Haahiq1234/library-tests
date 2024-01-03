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
function draw_Text(text_str, x, y, w, h) {
    if (w < 0) {
        x += w;
        w *= -1;
    }
    if (h < 0) {
        y += h;
        h *= -1;
    }

    let prevFont = ctx.font.split("px");
    let prevFontSize = parseInt(prevFont[0]);
    //console.log(prevFont);
    let measure = measureText(text_str);
    //console.log(measure);


    let ratio = min(w / measure.width, h / measure.height);
    let newFontSize = prevFontSize * ratio;
    ctx.font = newFontSize + "px" + prevFont[1];

    let newMeasure = measureText(text_str);

    text(text_str, x + newMeasure.offset.x + (w - newMeasure.width) / 2, y + newMeasure.offset.y + (h - newMeasure.height) / 2);
    //nofill();
    //rect(x, y, w, h);
    ctx.font = prevFontSize + "px" + prevFont;
}