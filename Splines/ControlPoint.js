class ControlPoint {
    gizmo;
    a;
    b;
    static points = [];
    constructor(x, y) {
        this.gizmo = new Gizmo(x, y);
        this.a = new Gizmo(0, 20);
        this.b = new Gizmo(0, -20);

        this.a.setParent(this.gizmo, false);
        this.b.setParent(this.gizmo, false);

        this.a.pair(this.b, "move", function(a, b) {
            b.localPosition = a.localPosition.neg();
        });
        ControlPoint.points.push(this);
    }
    draw() {
        if (this.a.enabled) {
            let ap = this.a.position;
            line(ap.x, ap.y, this.gizmo.px, this.gizmo.py);
        }
        if (this.b.enabled) {
            let bp = this.b.position;
            line(bp.x, bp.y, this.gizmo.px, this.gizmo.py);
        }
    }
}