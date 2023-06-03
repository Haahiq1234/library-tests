class Spline {
    constructor() {
        this.controls = [];
        this.curves = [];
        this.res = 0.01;
        this.lineWidth = 6;
    }
    addPoint(x, y) {
        let point = new ControlPoint(x, y);
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
    }
    draw() {
        for (var control of this.controls) {
            control.draw();
        }
        for (var curve of this.curves) {
            curve.calculate();
        }
        for (var t = 0; t <= 1; t += this.res) {
            let t_square = t * t;
            let t_cube = t_square * t;
            for (var curve of this.curves) {
                let p = curve.p(t, t_square, t_cube);
                circle(p.x, p.y, this.lineWidth / 2);
            }
        }
    }
}