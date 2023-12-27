const WIDTH = 500;
const HEIGHT = 500;


const shapeVertices = [
    0, 0,
    WIDTH, 0,
    WIDTH, HEIGHT,
    0, HEIGHT,

    100, 100,
    300, 100,
];

const indices = [
    0, 1,
    1, 2,
    2, 3,
    3, 0,

    4, 5,
];

const circles = [
    [300, 400, 40],
    [150, 200, 40]
];
const rects = [
    [400, 300, 40, 40],
    [400, 100, 40, 40],
];

function cast(origin, dir) {
    let indexedLinesCast = Raycast.indexedShape(origin.x, origin.y, dir.x, dir.y, shapeVertices, indices);
    let rectsCast = Raycast.rects(origin.x, origin.y, dir.x, dir.y, rects);
    let circlesCast = Raycast.circles(origin.x, origin.y, dir.x, dir.y, circles);
    return RaycastHit.nearest(origin, indexedLinesCast, circlesCast, rectsCast);
}