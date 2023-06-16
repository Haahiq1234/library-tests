const MIN_VALUE = -0.5;
const MAX_VALUE = 1;
const GROUND = 0.25;

const SMOOTHNESS = 8;

class Grid {
    constructor(width, height) {

        this.width = width;
        this.height = height;

        this.size = (this.width + 1) * (this.height + 1);

        this.array = [];
    }
    init() {
        this.cellwidth = CanvasWidth / this.width;
        this.cellheight = CanvasHeight / this.height;
        this.randomGenerate();
    }
    addSphere(x, y, r) {

    }
    index(x, y) {
        return x + y * (this.width + 1);
    }
    pos(i) {
        let x = i % (this.width + 1);
        let y = (i - x) / (this.width + 1)
        return [x, y];
    }
    randomGenerate() {
        for (var i = 0; i < this.size; i++) {
            let p = this.pos(i);
            this.array[i]  = noise(p[0] / SMOOTHNESS, p[1] / SMOOTHNESS) * (MAX_VALUE - MIN_VALUE) + MIN_VALUE;
        }
    }
    draw(x = 0, y = 0, w = this.width, h = this.height) {

        for (var i = x; i < (x + w); i++) {
            for (var j = y; j < (y + h); j++) {
                this.march(i, j,
                    this.array[this.index(i, j)],
                    this.array[this.index(i + 1, j)],
                    this.array[this.index(i + 1, j + 1)],
                    this.array[this.index(i, j + 1)]
                    );
            }
        }
    }
    march(i, j, a_value, b_value, c_value, d_value) {
        let a_isGround = isGround(a_value);
        let b_isGround = isGround(b_value);
        let c_isGround = isGround(c_value);
        let d_isGround = isGround(d_value);


        let bin =  `${a_isGround}${b_isGround}${c_isGround}${d_isGround}`;
        let cas = base10(bin);
        //console.log(bin, cas);
        let arr = [];

        let av = new Vector2(i * this.cellwidth,       j * this.cellheight);
        let bv = new Vector2((i + 1) * this.cellwidth, j *   this.cellheight);
        let cv = new Vector2((i + 1) * this.cellwidth, (j + 1) * this.cellheight);
        let dv = new Vector2(i * this.cellwidth,       (j + 1) * this.cellheight);

        let at = constraint(normalize(a_value, b_value, GROUND), 0, 1);
        let bt = constraint(normalize(b_value, c_value, GROUND), 0, 1);
        let ct = constraint(normalize(c_value, d_value, GROUND), 0, 1);
        let dt = constraint(normalize(d_value, a_value, GROUND), 0, 1);

        let a = createVector((i + at) * this.cellwidth, j * this.cellheight);
        let b = createVector((i + 1) * this.cellwidth, (j + bt) * this.cellheight);
        let c = createVector((i + 1 - ct) * this.cellwidth, (j + 1) * this.cellheight);
        let d = createVector(i * this.cellwidth, (j + 1 - dt) * this.cellheight);

        noStroke();
        fill(0, 255, 0);
        beginShape();
        if (a_isGround) {
            arr.push(d, av, a);
        }
        if (b_isGround) {
            arr.push(a, bv, b);
        }
        if (c_isGround > GROUND) {
            arr.push(b, cv, c);
        }
        if (d_isGround > GROUND) {
            arr.push(c, dv, d);
        }
        for (var v of arr) {
            vertex(v.x, v.y);
        }
        endShape();
        switch (cas) {
            case 1:
                ln(d, c);
                break;
            case 2:
                ln(b, c);
                break;
            case 3:
                ln(b, d);
                break;
            case 4:
                ln(a, b);
                break;
            case 5:
                ln(a, d);
                ln(b, c);
                break;
            case 6:
                ln(a, c);
                break;
            case 7:
                ln(a, d);
                break;
            case 8:
                ln(a, d);
                break;
            case 9:
                ln(a, c);
                break;
            case 10:
                ln(a, b);
                ln(c, d);
                break;
            case 11:
                ln(a, b)
                break;
            case 12:
                ln(b, d);
                break;
            case 13:
                ln(b, c);
                break;
            case 14:
                ln(c, d);
                break;
            default:
                break;
        }
    }
}
            let lines = [];
            // function draw() {
            //     //clear();
            //     //drawLines(lines);
            // }
            function ln(A, B) {
                line(A.x, A.y, B.x, B.y);
                //lines.push(A.x, A.y, B.x, B.y);
            }
            function pt(P) {
                circle(P.x, P.y, 2);
            }
            function isGround(v) {
                return v > GROUND ? 1 : 0;
            }
            function base10(num, base = 2) {
                let ans = 0;
                let len = num.length;
                for (var i = 0, j = num.length - 1; i < num.length; i++, j--) {
                    let i2 = num.length - 1 - i;
                    let i3 = parseInt(num[i]);
                    //console.log(i3);
                    ans += i3 * (base ** i2);
                }
                return ans;
            }
class Painter {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
    update() {

    }
}