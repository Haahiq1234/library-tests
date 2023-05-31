const ZOOM_SENSITIVITY = 1.2;

class CameraSystem {
    constructor(sensitivity = ZOOM_SENSITIVITY) {
        this.sensitivity = sensitivity;

        this.x = 0;
        this.y = 0;

        this.scaleX = 1;
        this.scaleY = 1;

        var system = this;
        on.wheel.bind(function (delta) {system.zoom(delta, mouse.x, mouse.y);});
        //on.mousemove.bind(redraw);
        this.zoomed = 1;
    }
    translate(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    transform(x, y) {
        let nx = this.scaleX * x + this.x;
        let ny = this.scaleY * y + this.y;
        return new Vector2(nx, ny); 
    }
    deform(x, y) {
        return new Vector2((x - this.x) / this.scaleX, (y - this.y) / this.scaleY);
    }
    deformx(x) {
        return (x - this.x) / this.scaleX;
    }
    deformy(y) {
        return (y - this.y) / this.scaleY;
    }
    transformx(x) {
        return x * this.scaleX + this.x;
    }
    transformy(y) {
        return y * this.scaleY + this.y;
    }
    zoom(delta, x, y) {
        
        let zoom = this.sensitivity ** delta;
        this.zoomed *= zoom;            
        this.x = this.x * zoom + x * (1 - zoom);
        this.y = this.y * zoom + y * (1 - zoom);
        this.scaleX *= zoom;
        this.scaleY *= zoom;
    }
    update() {
        if (mousePressed) 
            this.translate(Mouse.dx, Mouse.dy);
    }
    line(ax, ay, bx, by) {
        let a = this.transform(ax, ay);
        let b = this.transform(bx, by);
        line(a.x, a.y, b.x, b.y);
    }
    circle(x, y, r) {
        let p = this.transform(x, y);
        circle(p.x, p.y, r * this.zoomed);
    }
    rect(x, y, w, h) {
        let p = this.transform(x, y);
        rect(p.x, p.y, w * this.scaleX, h * this.scaleY);
    }
}