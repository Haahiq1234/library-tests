class Turtle {
    current;
    angle = 0;
    constructor() {
        var turtle = this;
        on.start.bind(() => turtle.init());
    }
    init() {
        this.jumpTo(CanvasWidth / 2, CanvasHeight / 2);
        console.log(this);
    }
    jumpTo(x, y) {
        if (!this.current) {
            this.current = new Vector2();
        }
        this.current.set(x, y);
    }
    moveTo(x, y) {
        line(this.current.x, this.current.y, x, y);
        this.current.set(x, y);
    }
    move(len) {
        let v = Vector.FromAngle(this.angle, len);
        line(this.current.x, this.current.y, this.current.x + v.x, this.current.y + v.y);
        this.current.add(v);
    }
    jump(len) {
        let v = Vector.FromAngle(this.angle, len);
        this.current.add(v);
    }
    rotate(ang) {
        this.angle += ang;
    }
    rotateTo(ang) {
        this.angle = ang;
    }
    turn(ang) {
        this.angle += ang;
    }
    turnTo(ang) {
        this.angle = ang;
    }
}