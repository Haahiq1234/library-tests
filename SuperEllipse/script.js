const inc = 1;
let t = 0;
let frames = 360;
const t_S = new Slider(50, 350, 50, 50, 0, 1, 0.5);
t_S.name("t", 20, 0, 20);
t_S.text((sl) => sl.value(100), 20);

function setUp() {
    createCanvas(400, 400);
    frameRate(60);
    nofill();
}
function draw() {
    clear();
    translate(CanvasWidth / 2, CanvasHeight / 2);
    //t = (Control.FRAME_NO % frames) / (frames - 1);
    t = t_S.value();
    beginShape();

    for (var angle = 0; angle < 360; angle += inc) {
        let p = square.xyr(angle);
        vertex(p.x, p.y);
    }
    endShape();
}
const SuperEllipse = {
    a: 150,
    b: 100,
    n: 10,
    na: 2 / this.n,
    xy: function(angle) {
        var na = 2 / this.n;
        let ca = cos(angle);
        let sa = sin(angle);
        let x = pow(abs(ca), na) * this.a * sign(ca);
        let y = pow(abs(sa), na) * this.b * sign(sa);
        return new  Vector2(x, y);
    },
    xyr: function(angle) {
        let r = this.r(angle);
        return new Vector2(cos(angle), sin(angle)).mult(r);
    },
    r: function(a) {
        return (this.a * this.b) / (((this.b * cos(a)) ** this.n + (this.a * sin(a)) ** this.n) ** (1 / this.n))
    }
}
const square = {
    a: 200,
    xyr: function(angle) {
        let r = lerp(this.a / 2, this.r(angle), t);
        return new Vector2(cos(angle), sin(angle)).mult(r);
    },
    r: function(angle) {
        let ca = cos(angle);
        let sa = sin(angle);
        return this.a / (abs(sa + ca) + abs(sa - ca))
    }
}
function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}