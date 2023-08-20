/// <reference path='../Canvas.js' />
/// <reference path='../Physics2D.js' />

const ROPE_LENGTH = 150;
const ROPE_SEGMENTS = 20;
const SEGMENT_LENGTH = ROPE_LENGTH / ROPE_SEGMENTS;

const DERP_LENGTH = 25;

const physics = new Physics2DSystem();
physics.gravity = new Vector2(0, 0.2);
physics.SetTimeDependency(false);

let start;

function setUp() {
    createCanvas();
    frameRate(60);
    physics.addBounds(new Rect(0, 0, CanvasWidth, CanvasHeight));
    for (var i = 0; i <= ROPE_SEGMENTS; i++) {
        physics.addPoint(new Physics2DMassPoint(CanvasWidth / 5, i * SEGMENT_LENGTH));
    }
    physics.points[0].lock();
    physics.points[physics.points.length - 1].lock();
    for (var i = 0; i < physics.points.length - 1; i++) {
        physics.addSpring(new Physics2DSpring(physics.points[i], physics.points[i + 1], 0.5, 0.15, SEGMENT_LENGTH + 5));
    }
    lineWidth(10);
    lineCap(LINE.ROUND);
}
function draw() {
    clear();
    if (mousePressed) {
        console.log("doing");
        let tail = physics.points[physics.points.length - 1];
        tail.pos = Vector.derp(tail.pos, mouse, DERP_LENGTH);
        tail.vel.set(0, 0);
    }
    physics.update();
    for (var point of physics.points) {
        //circle(point.pos.x, point.pos.y, 2);
    }
    for (var spring of physics.springs) {
        line(spring.a.pos.x, spring.a.pos.y, spring.b.pos.x, spring.b.pos.y);
    }
}