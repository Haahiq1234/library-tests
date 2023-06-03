class Curve {
    cpA;
    cpB;
    constructor(cpA, cpB) {
        this.cpA = cpA;
        this.cpB = cpB;
        this.res = 0.02;
    }
    calculate() {
        this.a = this.cpA.gizmo.localPosition;
        this.b = this.cpA.b.position;
        this.c = this.cpB.a.position;
        this.d = this.cpB.gizmo.localPosition;
    }
    draw() {
        this.calculate();
        for (var t = 0; t < 1; t += this.res) {
            let p = this.p(t, t ** 2, t **3);
            //console.log(p);
            circle(p.x, p.y, 4);
        }
    }
    p(t, t_square, t_cube) {
        return Vector.add(
                Vector.mult(this.a, -t_cube + 3 * t_square - 3 * t + 1),
                Vector.mult(this.b, 3 * t_cube - 6 * t_square + 3 * t),
                Vector.mult(this.c, -3 * t_cube + 3 * t_square),
                Vector.mult(this.d, t_cube),
            );
    }
}