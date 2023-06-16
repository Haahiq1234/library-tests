class Spline {
    constructor() {
        this.controls = [];
        this.curves = [];
        this.res = 0.05;
        this.lineWidth = 5;
    }
    addPoint(x, y, dx=0, dy=20) {
        let point = new ControlPoint(x, y, dx, dy);
        if (this.controls.length == 0) {
            point.a.Disable();
        } else {
            let prev = this.controls[this.controls.length - 1];
            prev.b.Enable();
            //UI.Selected = point.a;

            point.b.Disable();
            this.curves.push(new Curve(prev, point));
        }
        this.controls.push(point);
        return point;
    }
    draw() {
        for (var control of this.controls) {
            control.draw();
        }
        let previous;
        lineWidth(this.lineWidth);
        for (var i = 0; i < this.curves.length; i++) {
            let curve = this.curves[i];
            curve.calculate();
            for (var t = 0; (t < 1) || (i == this.curves.length - 1 && t <= 1); t += this.res) {
                let t_square = t * t;
                let t_cube = t_square * t;
                let current = curve.p(t, t_square, t_cube);

                if (previous) {
                    line(previous.x, previous.y, current.x, current.y);
                }
                previous = current;
                //circle(p.x, p.y, this.lineWidth / 2);
            }
        }
    }
}