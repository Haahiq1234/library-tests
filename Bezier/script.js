/// <reference path='..\Canvas.js' />


const oGizmo = new Gizmo(100, 100);
const rGizmo = new Gizmo(150, 100);
rGizmo.setParent(oGizmo);

const aGizmo = new Gizmo(300, 100);
const bGizmo = new Gizmo(300, 300);
const cGizmo = new Gizmo(100, 300);


function setUp() {
    createCanvas(400, 400);
    frameRate(60);
}
function draw() {
    clear();
    const a = aGizmo.localPosition;
    const b = bGizmo.localPosition;
    const c = cGizmo.localPosition;

    const o = oGizmo.localPosition;
    const r = rGizmo.localPosition;

    line(a.x, a.y, b.x, b.y);
    line(c.x, c.y, b.x, b.y);

    line(o.x, o.y, o.x + r.x, o.y + r.y);

    DrawBezier(a.x, a.y, b.x, b.y, c.x, c.y);

    let hits = BezierRayCast(o.x, o.y, r.x, r.y, a.x, a.y, b.x, b.y, c.x, c.y);
    for (let i = 0; i < hits.length; i++) {
        circle(hits[i].x, hits[i].y, 5);
    }
}

function DrawBezier(ax, ay, bx, by, cx, cy, resolution = 100) {
    for (let i = -resolution * 4; i <= resolution * 5; i++) {
        let t = i / resolution;

        let x = Beziert(ax, bx, cx, t);
        let y = Beziert(ay, by, cy, t);

        circle(x, y, 1);
    }
}

function BezierRayCast(ox, oy, rx, ry, ax, ay, bx, by, cx, cy) {
    let fx = ax - 2 * bx + cx;
    let fy = ay - 2 * by + cy;

    let gx = 2 * (bx - ax);
    let gy = 2 * (by - ay);

    let hx = ax;
    let hy = ay;

    let a = ry * fx - rx * fy;
    let b = ry * gx - rx * gy;
    let c = ry * (hx - ox) - rx * (hy - oy);

    let ts = QuadraticFormula(a, b, c);
    if (ts.length == 0) return [];
    let points = [];
    for (let i = 0; i < ts.length; i++) {
        let t = ts[i];
        let t_squared = t ** 2;
        points.push(new Vector2(t_squared * fx + t * gx + hx, t_squared * fy + t * gy + hy));
    }
    return points;
}
function Beziert(a, b, c, t) {
    let e = a + t * (b - a);
    let f = b + t * (c - b);
    return e + t * (f - e);
}