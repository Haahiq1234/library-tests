///<reference path="../Canvas.js"/>
///<reference path="../QuadTree/QuadTree.js"/>
const flock = [];
let qt;



function setUp() {
    createCanvas(1000, 600, "black");
    for (var i = 0; i < 400; i++) {
        flock.push(new Boid(Random.range(CanvasWidth), Random.range(CanvasHeight)));
    }
}
function draw() {
    clear();
    qt = new QuadTree(0, 0, CanvasWidth, CanvasHeight);
    for (let boid of flock) {
        qt.insert(boid.x, boid.y, boid);
    }
    for (let boid of flock) {
        boid.run(qt);
        if (mousePressed) {
            boid.pursue(mouse);
        }
    }
}