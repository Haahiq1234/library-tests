/// <reference path='..\Canvas.js' />

const a = new Gizmo(200, 200);
const b = new Gizmo(300, 200);
b.setParent(a);

function setUp() {
    createCanvas(WIDTH, HEIGHT);
    frameRate(60);
    lineWidth(2);
}
function draw() {
    clear();


    nofill();
    multicast(a.localPosition, b.localPosition);
    Draw.IndexedLines(shapeVertices, indices);
    Draw.Circles(circles);
    Draw.Rects(rects);
}

function multicast(origin, dir, n = 10) {
    let rayCastHit = cast(origin, dir);
    if (rayCastHit.hit) {
        circle(rayCastHit.point.x, rayCastHit.point.y, 6);
        line(rayCastHit.point.x, rayCastHit.point.y, origin.x, origin.y);
        stroke(255, 0, 0);
        line(rayCastHit.point.x, rayCastHit.point.y,
            rayCastHit.point.x + rayCastHit.normal.x * 20, rayCastHit.point.y + rayCastHit.normal.y * 20);
        stroke(0);
        if (n > 0) {
            let reflectedRay = Vector.reflect(dir, rayCastHit.normal);
            //line(rayCastHit.point.x, rayCastHit.point.y,
            //    rayCastHit.point.x + reflectedRay.x * 2, rayCastHit.point.y + reflectedRay.y * 2);
            multicast(rayCastHit.point, reflectedRay, n - 1);
        }
    }
}