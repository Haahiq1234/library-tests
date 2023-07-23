const shapes = [
    {
        points: [
            new Vector2(0, 0),
            new Vector2(0, 1),
            new Vector2(0, 2),
            new Vector2(0, 3),
        ],
        center: new Vector2(0, 1)
    },
    {
        points: [
            new Vector2(0, 0),
            new Vector2(0, 1),
            new Vector2(1, 0),
            new Vector2(1, 1),
        ],
        center: new Vector2(0.5, 0.5)
    },
    {
        points: [
            new Vector2(0, 0),
            new Vector2(0, 1),
            new Vector2(0, 2),
            new Vector2(1, 2),
        ],
        center: new Vector2(0, 1)
    },
    {
        points: [
            new Vector2(0, 0),
            new Vector2(0, 1),
            new Vector2(0, 2),
            new Vector2(-1, 2),
        ],
        center: new Vector2(0, 1)
    },
    {
        points: [
            new Vector2(0, 0),
            new Vector2(0, 1),
            new Vector2(-1, 1),
            new Vector2(1, 1),
        ],
        center: new Vector2(0, 1)
    },
    {
        points: [
            new Vector2(-1, 0),
            new Vector2(0, 0),
            new Vector2(0, 1),
            new Vector2(1, 1),
        ],
        center: new Vector2(0, 0)
    },
    {
        points: [
            new Vector2(1, 0),
            new Vector2(0, 0),
            new Vector2(0, 1),
            new Vector2(-1, 1),
        ],
        center: new Vector2(0, 0)
    }
]
let cols = [
    "orange",
    "red",
    "green",
    "cyan",
    "blue",
    "purple",
    "lime",
    "yellow",
];

class Shape {
    constructor(grid, framesPerMovement) {
        this.grid = grid;
        this.id = Random.rangeInt(0, shapes.length);
        //this.id = shapes.length - 1;
        this.framesPerMovement = framesPerMovement;
        this.center = Vector.add(shapes[this.id].center, grid.start);
        this.points = shapes[this.id].points.map((a) => new Vector2(a.x + grid.start.x, a.y + grid.start.y));
        if (!grid.possible(this.points)) {
            this.draw();
            this.grid.end();
        }
        this.color = Random.element(cols);
    }
    update() {
        if (Control.FRAME_NO % this.framesPerMovement == 0) {
            if (!this.tryMove(this.grid.gravity)) {
                this.finish();
            }
        }
        this.draw();
    }
    draw(shouldNotPreview = false) {
        if (!shouldNotPreview) {
            let pts = this.moveWhilePossible(this.grid.gravity);
            setAlpha(122);
            for (var p of pts) {
                this.grid.cell(p.x, p.y, this.color);
            }
            setAlpha(255);

        }
        for (var p of this.points) {
            this.grid.cell(p.x, p.y, this.color);
        }

    }
    rotate() {
        this.forEach((p) => rotPoint(Vector.sub(p, this.center)).add(this.center));
    }
    forEach(func) {
        let nPoints = this.points.map(func);
        if (this.grid.possible(nPoints)) {
            this.points = nPoints;
            return true;
        }
        return false;
    }
    tryWhilePossible(func) {
        let pPoints = pts;
        let pts = this.points;
        while (this.grid.possible(pts)) {
            pPoints = pts;
            pts = pts.map(func);
        }
        return pPoints;
    }
    moveWhilePossible(dir, draw) {
        let stp = this.points;
        let pts = this.points;
        let pPoints = pts;
        setAlpha(122);
        while (this.grid.possible(pts)) {
            if (draw) {
                this.draw(true);
            }
            pPoints = pts;
            pts = pts.map((p) => Vector.add(p, dir));
        }
        this.points = stp;
        setAlpha(255);
        return pPoints;
    }
    tryMove(dir) {
        if (this.forEach((p) => Vector.add(p, dir))) {
            this.center.add(dir);
            return true;
        }
        return false;
    }
    finish() {
        let miny = this.points[0].y;
        let maxy = this.points[0].y;
        for (var point of this.points) {
            this.grid.set(point.x, point.y, this.color);
            miny = min(miny, point.y);
            maxy = max(maxy, point.y);
        }
        this.draw();
        this.grid.check(miny, maxy);
        this.grid.reselect();
    }
    forceFinish() {
        let pts = this.moveWhilePossible(this.grid.gravity, true);
        fill(this.color);
        noStroke();
        setAlpha(255);
        for (var i = 0; i < this.points.length; i++) {
            rect(this.points[i].x, this.points[i].y, pts[i].x - this.points[i].x, pts[i].y - this.points[i].y);
        }
        this.points = pts;
        setAlpha(255);
        this.finish();
    }
}
function rotPoint(p) {
    return new Vector2(-p.y, p.x);
}