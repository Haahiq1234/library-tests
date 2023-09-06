/// <reference path='../Canvas.js' />

const a = new Gizmo(100, 100);
const b = new Gizmo(300, 100);
const c = new Gizmo(200, 300);

function setUp() {
    createCanvas(400, 400);
    frameRate(60);
    nofill();
}
function draw() {
    clear();
    let ax = a.lx();
    let ay = a.ly();
    let bx = b.lx();
    let by = b.ly();
    let cx = c.lx();
    let cy = c.ly();
    line(ax, ay, bx, by);
    line(cx, cy, bx, by);


    let abx = (ax + bx) / 2;
    let aby = (ay + by) / 2;

    let bcx = (bx + cx) / 2;
    let bcy = (by + cy) / 2;

    let abnx = -(by - ay);
    let abny = (bx - ax);


    let bcnx = -(cy - by);
    let bcny = (cx - bx);

    let intersection = lineIntersection(
        abx + abnx, aby + abny, abx - abnx, aby - abny,
        bcx + bcnx, bcy + bcny, bcx - bcnx, bcy - bcny
    );

    if (!intersection.parallel) {
        let m = intersection.point;
        circle(m.x, m.y, Vector.dist(a.localPosition, m));
        circle(m.x, m.y, 2);
        line(3 * bcx - 2 * m.x, 3 * bcy - 2 * m.y, m.x * 2 - bcx, m.y * 2 - bcy);
        line(3 * abx - 2 * m.x, 3 * aby - 2 * m.y, m.x * 2 - abx, m.y * 2 - aby);
    }

    //line(abx + abnx, aby + abny, abx - abnx, aby - abny);
    //line(bcx + bcnx, bcy + bcny, bcx - bcnx, bcy - bcny);
}