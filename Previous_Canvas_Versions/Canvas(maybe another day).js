// #region Vectors
function print(...message) {
    console.log(...message);
}
const Vector = {};
{// vectors
    function createVector(x, y) {
        return new Vector2(x | 0, y | 0);
    }
    Vector.array = function (...vecs) {
        let ans = [];
        for (var vec of vecs) {
            ans.push(...vec.array());
        }
        return ans;
    }
    Vector.setRotation = function (a, b, rot) {
        let c = Vector.sub(b, a);
        c.setRotation(rot);
        return Vector.add(a, c);
    }
    Vector.interpolateArray = function (arr, index) {
        let i = floor(index);
        let ir = index - i;
        let ans = arr[i].copy();
        if (i < arr.length - 1 && ir > 0) {
            let subbed = Vector.sub(arr[i + 1], ans);
            ans.add(Vector.mult(subbed, ir));
        }
        return new Vector2(ans.x, ans.y);
    }
    Vector.setMag = function (vec, mag) {
        let vec1 = Vector.copy(vec).setMag(mag);
        return vec1;
    }
    Vector.InSquare = function (a, b, p) {
        if (p.x >= a.x && p.y >= a.y && p.x <= b.x && p.y <= b.y) {
            return true;
        }
        return false
    }
    Vector.AngleToEllipse = function (ang, px, py, rot = 0, nx = px, ny = py) {
        let x = Math.cos(radians(ang));
        let y = Math.sin(radians(ang));
        if (x < 0) {
            x *= nx;
        } else if (x > 0) {
            x *= px;
        }
        if (y < 0) {
            y *= ny;
        } else if (y > 0) {
            y *= py;
        }
        let vec = new Vector2(x, y);
        vec.rotate(rot);
        return vec;
    }
    Vector.mid = function (a, b) {
        let c = Vector.sub(b, a).mult(0.5);
        let p = Vector.add(a, c);
        return p;
    }
    Vector.copy = function (vec) {
        return new Vector2(vec.x, vec.y);
    }
    Vector.SideOfLine = function (a, b, p) {
        let c = Vector.mid(a, b);
        let dir = Vector.Direction(c, p);
        let aa = Vector.Direction(c, a);
        let ba = Vector.Direction(c, b);
        if (BetweenRotations(aa, ba, dir)) {
            return -90;
        } else {
            return 90;
        }
    }
    Vector.normal = function (a, b, p) {
        let rot = this.SideOfLine(a, b, p);
        let c = Vector.DirectionVector(a, b);
        c.rotate(rot);
        return c;
    }
    function BetweenRotations(a, b, r) {
        if (r + 90 > 360 && b < r) {
            b += 360;
        }
        if (r - 90 < 0 && r < a) {
            a -= 360;
        }
        return (r >= a && r <= b);
    }
    Vector.constaint = function (p, a, b) {
        let x = constraint(p.x, a.x, b.x);
        let y = constraint(p.y, a.y, b.y);
        return createVector(x, y);
    }
    Vector.interpolate = function (a, b, t) {
        let c = Vector.sub(b, a);
        c.mult(t);
        return Vector.add(a, c);
    }
    Vector.lerp = function (A, B, t) {
        let C = Vector.sub(B, A);
        C.mult(t);
        C.add(A);
        return C;
    }
    Vector.mult = function (vec, m) {
        vec = new Vector2(vec.x * m, vec.y * m);
        return vec;
    }
    Vector.min = function (...args) {
        args = splitArray(args);
        return createVector(Math.min(...args.x), Math.min(...args.y));
    }
    Vector.neg = function (vec) {
        return new Vector2(-vec.x, -vec.y);
    }
    Vector.avg = function (...vecs) {
        let vector = new Vector2(0, 0);
        for (var i = 0; i < vecs.length; i++) {
            vector.add(vecs[i]);
        }
        vector.div(vecs.length);
        return vector;
    }
    Vector.max = function (...args) {
        args = splitArray(args);
        return createVector(Math.max(...args.x), Math.max(...args.y));
    }
    Vector.add = function () {
        var vec = arguments[0].copy();
        for (var i = 1; i < arguments.length; i++)
            vec.add(arguments[i].copy());
        return new Vector2(vec.x, vec.y);
    }
    Vector.sub = function (vec, vec1) {
        vec = vec.copy();
        vec1 = vec1.copy();
        vec.sub(vec1);
        return new Vector2(vec.x, vec.y);
    }
    Vector.heading = function (vec) {
        if (vec.x == 0 && vec.y == 0) {
            return 0;
        }
        var ang = Math.atan2(vec.x, vec.y);
        ang = 180 - degrees(ang);
        ang -= 90;
        if (ang < 0) {
            ang = 360 + ang;
        }
        return ang;
    }
    Vector.AngleToVector = function (ang, rad) {
        let x = rad * Math.cos(radians(ang));
        let y = rad * Math.sin(radians(ang));
        return new Vector2(x, y);
    }
    Vector.div = function (vec, no) {
        vec = vec.copy();
        vec.div(no);
        return vec;
    }
    Vector.random2D = function () {
        return this.AngleToVector(Random.range(0, 360), 1);
    }
    Vector.DirectionVector = function (vec, vec1) {
        let d = new Vector2(vec1.x - vec.x, vec1.y - vec.y).normalize();
        return d;
    }
    Vector.Direction = function (a, b) {
        return this.DirectionVector(a, b).heading();
    }
    Vector.dist = function (vec, vec1, x1, y1) {
        let d = new Vector2(vec1.x - vec.x, vec1.y - vec.y).mag();
        return d;
    }
    Vector.limitDistance = function (a, b, lim) {
        let c = Vector.sub(b, a);
        c.limit(lim);
        return Vector.add(a, c);
    }
    Vector.setDist = function (a, b, dst) {
        let c = Vector.sub(b, a);
        let ang = c.heading();
        let d = Vector.AngleToVector(ang, dst);
        return Vector.add(a, d);
    }
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
        this.add = function (addition, y) {
            if (y) {
                this.x += addition;
                this.y += y;
                return this;
            }
            this.x += addition.x;
            this.y += addition.y;
            return this;
        }
        this.array = function () {
            return [this.x, this.y];
        }
        this.mult = function (pow) {
            this.x *= pow;
            this.y *= pow;
            return this;
        }
        this.reset = function () {
            this.x = 0;
            this.y = 0;
            return this;
        }
        this.sub = function (vec, y) {
            if (y) {
                this.x -= vec;
                this.y -= y;
                return this;
            }
            this.x -= vec.x;
            this.y -= vec.y;
            return this;
        }
        this.rotate = function (deg) {
            let dir = this.heading();
            let len = this.mag();
            dir += deg;
            let vec = Vector.AngleToVector(dir, len);
            this.x = vec.x;
            this.y = vec.y;
        }
        this.set = function (nx, ny) {
            this.x = nx;
            this.y = ny;
            return this;
        }
        this.setMag = function (len) {
            this.normalize().mult(len);
            return this;
        }
        this.setRotation = function (rot) {
            let mag = this.mag();
            let vec = Vector.AngleToVector(rot, mag);
            this.set(vec.x, vec.y);
            return this;
        }
        this.mag = function () {
            return Math.sqrt(this.x ** 2 + this.y ** 2);
        }
        this.copy = function () {
            return new Vector2(this.x, this.y);
        }
        this.normalize = function () {
            this.div(this.mag());
            return this;
        }
        this.div = function (no) {
            this.x /= no;
            this.y /= no;
            return this;
        }
        this.neg = function () {
            return Vector.neg(this);
        }
        this.limit = function (no) {
            if (this.mag() > no)
                this.setMag(no);
            return this;
        }
        this.heading = function () {
            return Vector.heading(this);
        }
        this.xSlope = function () {
            return this.x / numberSign.positive(this.y);
        }
        this.ySlope = function () {
            return this.y / numberSign.positive(this.x);
        }
        this.setX = function (val) {
            let sl = this.ySlope();
            this.x = val;
            this.y = sl * numberSign.positive(val);
            return this;
        }
        this.setY = function (val) {
            let sl = this.xSlope();
            this.x = sl * numberSign.positive(val);
            this.y = val;
            return this;
        }
    }

} // code
// #endregion

//#region Input
var mouse = new Vector2(0, 0);
{
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        mouse.set(event.clientX, event.clientY);
        mouse2.set(event.clientX, CanvasHeight - event.clientY);
    }
    var key = {}
    key.up = "ArrowUp";
    key.down = "ArrowDown";
    key.right = "ArrowRight";
    key.left = "ArrowLeft";
    key.space = " ";
    key.enter = "Enter";
    key.backSpace = "Backspace";
    var keyCode;
    var pressedKeys = {
        a: false,
        b: false,
        c: false,
        d: false,
        e: false,
        f: false,
        g: false,
        h: false,
        i: false,
        j: false,
        k: false,
        l: false,
        m: false,
        n: false,
        o: false,
        p: false,
        q: false,
        r: false,
        s: false,
        t: false,
        u: false,
        v: false,
        w: false,
        x: false,
        y: false,
        z: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        0: false,
        " ": false
    };
    function GetAxis(TAxis, TKey) {
        if (TAxis == "horizontal") {
            if (TKey == "key") {
                if (pressedKeys["a"])
                    return -1;
                else if (pressedKeys["d"])
                    return 1;
            }
            if (TKey == "arrow") {
                if (pressedKeys[key.left])
                    return -1;
                else if (pressedKeys[key.right])
                    return 1;
            }
        }
        if (TAxis == "vertical") {
            if (TKey == "key") {
                if (pressedKeys["w"])
                    return -1;
                else if (pressedKeys["s"])
                    return 1;
            }
            if (TKey == "arrow") {
                if (pressedKeys[key.up])
                    return -1;
                else if (pressedKeys[key.down])
                    return 1;
            }
        }
        return 0;
    }
    document.onmousedown = function () { mousePressed = true;; if (window.mouse_Down) { mouse_Down(); } };
    document.onmouseup = function () {
        mousePressed = false; if (window.mouse_Up) { mouse_Up(); }
    };
    function GetKey(keyCode) {
        return pressedKeys[keyCode] | false;
    }

    document.addEventListener("keydown", function (event) {
        keyCode = event.key;
        if (!keyCode in pressedKeys || !pressedKeys[keyCode]) {
            if (window.key_Press) {
                key_Press();
            }
        }
        pressedKeys[keyCode] = true;
        if (window.key_Down) {
            key_Down();
        }
    });
    document.addEventListener("keyup", function (event) {
        keyCode = event.key;
        pressedKeys[keyCode] = false;
        if (window.key_Up) {
            key_Up();
        }
    });

    document.onclick = function () {
        if (window.mouse_Click) {
            mouse_Click();
        }
    };
} // code
//#endregion

// #region constants
const PI = Math.PI;
const RGB = "RGB";
const TEXT = {};
TEXT.CENTER = "center";
TEXT.MIDDLE = "middle";
TEXT.RIGHT = "right";
const LINE = {}
LINE.ROUND = "round";
LINE.BEVEL = "bevel";
LINE.MITER = "miter";
LINE.BUTT = "butt";
LINE.SQUARE = "square";
const GizmoShapes = {
    circle: 0,
    square: 1,
    rect: 2
}
Object.freeze(GizmoShapes);
// #endregion

// #region intervals
let Time = {
    deltaTime: 0,
    frameRate: 0,
    time: 0
}
{ // interval stuff
    var UnSetFps = true;
    let drawIntervalId;
    let animationFrameLoopId;
    document.body.onload = function () {
        if (window.setUp) {
            setUp();
        }
        requestAnimationFrame(redraw);
    }
    function frameRate(rate) {
        UnSetFps = false;
        Time.frameRate = rate;
        Time.deltaTime = 1000 / rate;
        Time.time = 0;
        if (drawIntervalId) {
            clearInterval(drawIntervalId);
        }
        FPS = rate;
        drawIntervalId = setInterval(redraw, 1000 / rate);
    }
    let loopGoing = true;
    function noLoop() {
        if (UnSetFps) {
            loopGoing = false;
            cancelAnimationFrame(animationFrameLoopId);
        }
        if (!UnSetFps) {
            clearInterval(drawIntervalId);
        }
    }
    function loop() {
        if (UnSetFps) {
            animationFrameLoopId = requestAnimationFrame(redraw);
        }
        if (!UnSetFps) {
            clearInterval(drawIntervalId | 0);
            drawIntervalId = setInterval(redraw, 1000 / FPS);
        }
    }
    function redraw(timeStamp) {
        if (window.draw) {
            if (UnSetFps && !loopGoing) {
                Time.time = timeStamp;
            }
            //ctx.scale(pixelDensity(), pixelDensity());
            for (var gizmo of gizmos) {
                if (gizmo.selfUpdate) {
                    gizmo.update();
                }
            }
            ctx.save();
            draw();
            saveColor();
            ctx.restore();
            loadColor();
            for (var gizmo of gizmos) {
                if (gizmo.selfDraw) {
                    gizmo.draw();
                }
            }
            frameNo += 1;
            if (UnSetFps) {
                Time.deltaTime = timeStamp - Time.time;
                Time.frameRate = 1000 / Time.deltaTime;
                Time.time = timeStamp;
                animationFrameLoopId = requestAnimationFrame(redraw);
            } else {
                Time.time += Time.deltaTime;
            }
        }
    }
} // interval stuff

// #endregion

// #region Math
function factorize(no) {
    let factors = [];
    for (let i = 1; i < no; i++) {
        if (no % i == 0) {
            factors.push(i);
            no /= i;
            i = 1;
        }
    }
    factors.push(no);
    return factors;
}
function factorial(no) {
    let fac = 1;
    for (var i = 1; i <= no; i++) {
        fac *= i;
    }
    return fac;
}
function primeFactors(no) {
    let factors = factorize(no);
    factors.shift();
    return factors;
}
function floor(no, floore = 1) {
    return no - (no % floore);
}
function HCF(no1, no2) {
    let factors1 = primeFactors(no1);
    let factors2 = primeFactors(no2);
    let lcmss = [1];
    for (var i = 0; i < factors1.length; i++) {
        for (var j = 0; j < factors2.length; j++) {
            if (factors1[i] == factors2[j]) {
                lcmss.push(factors1[i]);
                factors2.splice(j, 1);
                break;
            }
        }
    }
    return mult(...lcmss);
}
function LCM(no1, no2) {
    return (no1 * no2) / HCF(no1, no2);
}
function mult(...args) {
    let prod = 1;
    for (var arg of args) {
        prod *= arg;
    }
    return prod;
}
let Random = {
    range: function () {
        args = arguments;
        let r = 0;
        let a = 0;
        if (args.length > 1) {
            r = args[0];
            a = 1;
            args[1] -= args[0];
        }
        r += Math.random() * args[a];
        return r;
    },
    rangeInt: function RandomInt() {
        args = arguments;
        let r = 0;
        let a = 0;
        if (args.length > 1) {
            r = args[0];
            a = 1;
            args[1] -= args[0];
        }
        r += Math.floor(Math.random() * args[a]);
        return r;
    },
    element: function (arr) {
        let r = Math.floor(Math.random() * arr.length);
        return arr[r];
    },
    choice: function () {
        let r = this.rangeInt(arguments.length);
        return arguments[r];
    }
}
let geometry = {
    herosFormula: function (a, b, c) {
        let s = (a + b + c) / 2;
        let ar = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        return ar;
    },
    perpendicular: function (h, b) {
        return Math.sqrt(h * h - b * b);
    },
    base: function (h, p) {
        return Math.sqrt(h * h - p * p);
    },
    hypotenuse: function (b, p) {
        return Math.sqrt(b * b + p * p);
    }
}
function sign(no) {
    if (no < 0)
        return -1
    else if (no > 0)
        return 1
    else
        return 0;
}
function min(no, no1) {
    if (no1 < no)
        return no1;
    else
        return no;
}
function max(no, no1) {
    if (no1 > no)
        return no1;
    else
        return no;
}
function constraint(num, min, max) {
    if (min > max) {
        let tem = max;
        max = min;
        min = tem;
    }
    if (num < min)
        return min;
    else if (num > max)
        return max;
    else
        return num;
}
function dist(x1, y1, x2, y2) {
    return mag(x2 - x1, y2 - y1);
}
function mag(x, y) {
    return Math.sqrt(x ** 2 + y ** 2);
}
function constraintedAxis(num, min, max) {
    if (num < min)
        return -1;
    else if (num > max)
        return -1;
    else
        return 0;
}
function constrainted(num, min, max) {
    if (num < min || num > max)
        return true;
    else
        return false;
}
function map(no, min, max, minr, maxr) {
    return minr + ((maxr - minr) * normalize(no, min, max));
}
function normalize(no, min, max) {
    return (no - min) / (max - min);
}
function radians(deg) {
    return deg * PI / 180;
}
function degrees(rad) {
    return 180 * rad / PI;
}
let numberSign = {
    check: function (val) {
        if (val < 0)
            return -1;
        return 1;
    },
    positive: function (val) {
        return val * this.check(val);
    },
    negative: function (val) {
        return -val * this.check(val);
    }
}
function interpolateArray(arr, index) {
    let i = floor(index);
    let ir = index - i;
    let ans = arr[i];
    if (i < arr.length - 1) {
        ans += (arr[i + 1] - ans) * ir;
    }
    return ans;
}
// #endregion

// #region color
var fl = true;
var st = true;
function addAlpha(col, al, mode) {
    if ("RGB" == mode) {
        return col.replace("b(", "ba(").replace(")", ", " + al / 255 + ")")
    }
}
function colorMode(mode) {
    Canvas.colorMode = mode;
}
var alphaValues = [];
for (var i = 0; i < 255; i++) {
    i = Math.round(i * 100) / 100;
    var alpha = Math.round(i * 255);
    var hex = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();
    alphaValues.unshift(hex);
}
function color() {
    args = filterArray(arguments);
    if (typeof args[0] == "string") {
        return args[0];
    }
    if (Canvas.colorMode == "RGB") {
        if (args.length == 1) {
            args[0] = constraint(args[0], 0, 255);
            return "rgba(" + args[0] + ", " + args[0] + ", " + args[0] + ", 1)";
        } else if (args.length == 2) {
            args[0] = constraint(args[0], 0, 255);
            args[1] = constraint(args[1], 0, 255);
            return "rgba(" + args[0] + ", " + args[0] + ", " + args[0] + ", " + ((args[1] > 1) ? args[1] / 255 : args[1]) + ")";
        } else if (args.length == 3) {
            args[0] = constraint(args[0], 0, 255);
            args[1] = constraint(args[1], 0, 255);
            args[2] = constraint(args[2], 0, 255);
            return "rgba(" + args[0] + ", " + args[1] + ", " + args[2] + ", 1)";
        } else if (args.length == 4) {
            args[0] = constraint(args[0], 0, 255);
            args[1] = constraint(args[1], 0, 255);
            args[2] = constraint(args[2], 0, 255);
            args[3] = constraint(args[3], 0, 255);
            return "rgba(" + args[0] + ", " + args[1] + ", " + args[2] + ", " + ((args[3] > 1) ? args[3] / 255 : args[3]) + ")";
        }
    }
}
function splitRGB(rgb) {
    let col = rgb.split(", ");
    let r = parseFloat(col[0].split("rgba(")[1]);
    let g = parseFloat(col[1]);
    let b = parseFloat(col[2]);
    let a = parseFloat(col[3].slice(0, col[3].length - 1)) * 255;
    return {
        r: r,
        g: g,
        b: b,
        a: a,
        mult: function (t) {
            return color(r * t, g * t, b * t, a);
        },
        string: function () {
            return color(r, g, b, a);
        }
    };
}
const Color = {
    mult: function (col, t) {
        if ("rgba" in col) {
            let c = splitRGB(col);
            return c.mult(t);
        }
    }
}
function stroke() {
    var col = color(arguments[0], arguments[1], arguments[2], arguments[3]);
    ctx.strokeStyle = col;
    Canvas.strokeStyle = col;
}
function nofill() {
    fl = false;
    st = true;
}
function fill() {
    var col = color(arguments[0], arguments[1], arguments[2], arguments[3]);
    fl = true;
    ctx.fillStyle = col;
    Canvas.fillStyle = col;
}
function noStroke() {
    st = false;
    fl = true;
}
// #endregion

// #region drawing
const canvasX = function (x) {
    return x;
}
const canvasY = function (y) {
    return y * -1 + CanvasHeight;
}
let shape = {
    vertices: [],
    done: true,
    begin: function () {
        this.done = false;
        this.vertices = [];
    },
    addVertex: function (x, y) {
        this.vertices.push(createVector(canvasX(x), canvasY(y)));
    },
    close: function () {
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        ctx.lineTo(this.vertices[0].x, this.vertices[0].y);
        ctx.closePath();
        if (fl) {
            ctx.fill();
        }
        if (st) {
            ctx.stroke();
        }
    },
    draw: function () {
        for (var i = 0; i < arguments.length; i += 2) {
            arguments[i] = canvasX(arguments[i]);
            arguments[i + 1] = canvasY(arguments[i + 1]);
        }
        ctx.beginPath();
        ctx.lineTo(arguments[0], arguments[1]);
        ctx.closePath();
        for (var i = 2; i < arguments.length; i += 2) {
            ctx.lineTo(arguments[i], arguments[i + 1]);
        }
        ctx.lineTo(arguments[0], arguments[1]);
        ctx.closePath();
        if (fl) {
            ctx.fill();
        }
        if (st) {
            ctx.stroke();
        }
    }
};

function setPixel(x, y, col) {
    x = canvasX(x);
    y = canvasY(y);
    let c = ctx.fillStyle;
    ctx.fillStyle = col;
    ctx.fillRect(x, y, 1, 1);
    ctx.fillStyle = c;
}
function triangle(x, y, x1, y1, x2, y2) {
    x = canvasX(x);
    y = canvasY(y);
    x1 = canvasX(x1);
    y1 = canvasY(y1);
    x2 = canvasX(x2);
    y2 = canvasY(y2);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x, y);
    ctx.closePath();
    if (st) {
        ctx.stroke();
    }
    if (fl) {
        ctx.fill();
    }
}
function circle(x, y, r) {
    x = canvasX(x);
    y = canvasY(y);
    ctx.beginPath();
    r = max(r, 0);
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();
    if (st) {
        ctx.stroke();
    }
    if (fl) {
        ctx.fill();
    }
}
function ellipse(x, y, d, d1) {
    x = canvasX(x);
    y = canvasY(y);
    var c = ctx.strokeStyle;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.ellipse(x, y, d / 2, d1 / 2, 0, 0, 2 * Math.PI);
    ctx.closePath();
    if (fl) {
        ctx.fill();
    }
    if (st) {
        ctx.stroke();
    }
}
function point(x, y) {
    x = canvasX(x);
    y = canvasY(y);
    circle(x, y, ctx.lineWidth / 2);
}
function rect(x, y, w, h) {
    x = canvasX(x);
    y = canvasY(y);
    w = canvasX(w);
    h = canvasY(y);
    if (st) {
        ctx.beginPath();
        ctx.strokeRect(x, y, w, h);
        ctx.closePath();
    }
    if (fl) {
        ctx.fillRect(x, y, w, h);
    }
}
// #endregion

// #region Arrays
function create2DArray(cols, rows, fillVal) {
    let arr = new Array(cols);
    for (var i = 0; i < cols; i++) {
        if (typeof fillVal == "function") {
            arr[i] = new Array(rows).fill(fillVal());
        } else {
            arr[i] = new Array(rows).fill(fillVal);
        }
    }
    return arr;
}
function Array2D(width, height) {
    this.array = [];
    this.width = width;
    this.height = height;
    this.getCol = function (col) {
        let cl = [];
        for (var i = 0; i < this.width; i++) {
            cl.push(this.array[this.index(i, col)]);
        }
        return cl;
    }
    this.getRow = function (row) {
        let rw = this.array.slice(this.width * row, this.width * (row + 1));
        return rw;
    }
    this.set = function (x, y, val) {
        let ind = this.index(x, y);
        this.array[ind] = val;
    }
    this.index = function (x, y) {
        return y * this.width + x;
    }
    this.setRow = function (rw, row) {
        this.array.splice(this.width * row, this.width * (row + 1), ...rw);
    }
    this.setCol = function (cl, col) {
        for (var i = 0; i < this.width; i++) {
            this.array[this.index(i, col)] = cl[i];
        }
    }
    this.shuffleCol = function (cl) {
        this.setCol(shuffle(this.getCol(cl)), cl);
    }
    this.shuffleRow = function (rw) {
        this.setRow(shuffle(this.getRow(rw)), rw);
    }
    this.shuffle = function () {
        shuffle(this.array);
    }
    this.pos = function (ind) {
        let x = ind % this.width;
        let y = ind - x;
        return { col: x, row: y };
    }
    this.get = function (x, y) {
        return this.array[this.index(x, y)];
    }
    this.swap = function (x, y, x1, y1) {
        let ind1 = this.index(x, y);
        let ind2 = this.index(x1, y1);
        [this.array[ind1], this.array[ind2]] = [this.array[ind2], this.array[ind1]]
    }
    this.grid = function () {
        let arr = [];
        for (let x = 0; x < this.width; x++) {
            arr.push([]);
            for (let y = 0; y < this.height; y++) {
                arr[x].push(this.array[this.index(x, y)]);
            }
        }
        return arr;
    }
    this.transpose = function () {
        let grid = this.grid();
        let arr = [];
        for (let y = 0; y < this.height; y++) {
            arr.push([]);
            for (let x = 0; x < this.width; x++) {
                arr[y].push(this.array[this.index(x, y)]);
            }
        }
        return arr;
    }
    //this.transpose2 = function () {
    //    let grid = Object.assign({}, this);
    //    //let i = 0;
    //    console.table(grid.grid());
    //    for (let y = 0; y < this.height; y++) {
    //        for (let x = y; x < this.width; x++) {
    //            grid.swap(x, y, y, x);
    //            console.log(x, y);
    //        }
    //    }
    //    console.table(grid.grid());
    //    return grid;
    //}
    this.transpose2 = function () {
        let grid = new Array2D(this.height, this.width);
        console.table(this.grid());
        let cols = [];
        for (var i = 0; i < grid.width; i++) {
            cols.push(this.getCol(i));
        }
        for (var i = 0; i < cols.length; i++) {
            grid.setRow(cols[i]);
        }
        console.table(grid.grid());
        return grid;
    }
}
function shuffle(arr) {
    arr.sort(() => (Math.random() > .5) ? 1 : -1);
    return arr;
}
function filterArray(arr1, val) {
    let arr = [];
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] != val) {
            arr.push(arr1[i]);
        }
    }
    return arr;
}
function splitArray(arr) {
    let obj = {};
    for (let ob of arr) {
        for (let prop in ob) {
            if (!obj[prop]) {
                obj[prop] = [];
            }
            obj[prop].push(ob[prop]);
        }
    }
    return obj;
}
function indicesOf(arr, val) {
    let arr1 = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val)
            arr1.push(i);
    }
    return arr1;
}
// #endregion

const Canvas = {
    lineWidth: undefined,
    strokeStyle: undefined,
    fillStyle: undefined,
    colorMode: "RGB"
}
function parity(no) {
    if (no % 2 == 1) {
        return 1;
    }
    return 2;
}
const is = {};
is.odd = function (no) {
    if (parity(no) == 1) {
        return true;
    }
    return false;
}
is.even = function (no) {
    if (parity(no) == 2) {
        return true;
    }
    return false;
}
function beginPath() {
    ctx.beginPath();
}
function closePath() {
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}
var ctx, CanvasWidth, CanvasHeight, CanvasColor, mouseOverCanvas, CanvasOffset, mousePressed = false, mouse2 = createVector(0, 0);
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
CanvasWidth = windowWidth;
CanvasHeight = windowHeight;
var frameNo = 0;
function lineJoin(ty) {
    ctx.lineJoin = ty;
}
function lineCap(cap) {
    ctx.lineCap = cap;
}
function textAlign(al, aly) {
    ctx.textAlign = al;
    ctx.textBaseline = aly;
}
function textSize(size) {
    ctx.font = size + 'px Arial';
}
function text(txt, x, y) {
    x = canvasX(x);
    y = canvasY(y);
    if (!fl) {
        ctx.strokeText(txt, x, y);
    } else {
        ctx.fillText(txt, x, y);
    }
}
function downloadImage() {
    var link = document.createElement('a');
    link.download = 'Canvas_Image.png';
    link.href = ctx.canvas.toDataURL();
    link.click();
}
var scaled = new Vector2(1, 1);
function scale(x, y = x) {
    ctx.scale(x, y);
    scaled.x *= x;
    scaled.y *= y;
}
function resetScale() {
    ctx.scale(1 / scaled.x, 1 / scaled.y);
    scaled.x = 1;
    scaled.y = 1;
}
function canvasButton(x, y, width, height, col) {
    this.element = document.createElement("button");
    document.body.appendChild(this.element);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = col;
    this.bind = function (func) {
        this.element.onclick = func;
    }
    this.addClass = function (cl) {
        this.element.classList.add(cl);
    }
    this.text = function (tex) {
        this.element.innerHTML = tex;
    }
    this.element.style.position = "absolute";
    this.update = function () {
        this.element.style.top = this.y + CanvasOffset.y;
        this.element.style.left = this.x + CanvasOffset.x;
        this.element.style.width = this.width;
        this.element.style.height = this.height;
        this.element.style.color = this.color;
        this.element.style.backgroundColor = this.color;
    }
}
function lineWidth(w) {
    ctx.lineWidth = w;
    Canvas.lineWidth = w;
}
function createElement(elem, id) {
    var e = document.createElement(elem);
    e.setAttribute("id", id);
    document.body.appendChild(e);
    return e;
}
function createSlider(min, max, step, val) {
    let slider = document.createElement("input");
    slider.type = "range";
    slider.min = min;
    slider.value = val;
    slider.max = max;
    slider.step = step;
    document.body.appendChild(slider);
    return slider;
}
function createCanvas(w, h, col="rgb(255, 255, 255)") {
    var canvas = document.createElement("canvas");
    canvas.width = w;
    CanvasWidth = w;
    CanvasHeight = h;
    canvas.height = h;
    canvas.style.backgroundColor = col;
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    Canvas.lineWidth = ctx.lineWidth;
    Canvas.fillStyle = ctx.fillStyle;
    Canvas.strokeStyle = ctx.strokeStyle;
    canvas.style.border = "1px solid black";
    canvas.addEventListener("mouseover", function () { mouseOverCanvas = true; });
    canvas.addEventListener("mouseout", function () { mouseOverCanvas = false; });
    let el = canvas;
    var _x = 0;
    ctx.textAlign = "start";
    ctx.textBaseline = "top";
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    CanvasOffset = new Vector2(_x, _y);
    return canvas;
}
function clear() {
    let t = ctx.getTransform();
    ctx.resetTransform();
    //let x1 = 
    //console.log(-CanvasWidth * 5, -CanvasHeight * 5, CanvasWidth * 10, CanvasHeight * 10);
    ctx.clearRect(-CanvasWidth * 5, -CanvasHeight * 5, CanvasWidth * 10, CanvasHeight * 10);
    ctx.setTransform(t);
}
function backGround(...rgbs) {
    var col = color(...rgbs);
    var cl = ctx.fillStyle;
    ctx.fillStyle = col;
    ctx.fillRect(-CanvasWidth * 10, -CanvasHeight * 10, CanvasWidth * 10, CanvasHeight * 10);
    ctx.fillStyle = cl;
}
function line(x, y, x1, y1) {
    x = canvasX(x);
    y = canvasY(y);
    x1 = canvasX(x1);
    y1 = canvasY(y1);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.stroke();
}
function rotate(deg) {
    ctx.rotate(radians(deg));
}
function translate(x, y) {
    x = canvasX(x);
    y = canvasY(y);
    ctx.translate(x, y);
}
{
    let savedTransforms = [];
    function push() {
        let t = ctx.getTransform()
        savedTransforms.push(t);
        return t;
    }

    function pop() {
        let t = savedTransforms.pop();
        ctx.setTransform(t);
        return t;
    }
} // push and pop


const distance = {}
function lineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    let d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    let u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / d;  // belongs to x3, x4, y3, y4
    let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;  // belongs to x1, x2, y1, y2
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        let x = x1 + t * (x2 - x1);
        let y = y1 + t * (y2 - y1);
        return {
            t: t,
            u: u,
            point: createVector(x, y),
            intersected: true
        };
    } else {
        return {
            t: t,
            u: u,
            intersected: false
        }
    }
}
distance.rect2 = function (x, y, x1, y1, w, h) {
    if (w < 0) {
        x1 += w;
        w *= -1;
    }
    if (h < 0) {
        y1 += h;
        h *= -1;
    }
    let A = createVector(x1, y1);
    let B = createVector(x1 + w, y1);
    let C = createVector(x1 + w, y1 + h);
    let D = createVector(x1, y1 + h);
    let d = distance.shape(x, y, A.x, A.y, B.x, B.y, C.x, C.y, D.x, D.y);
    return d;
}
distance.rect = function (x, y, x1, y1, w, h) {
    if (w < 0) {
        x1 += w;
        w *= -1;
    }
    if (h < 0) {
        y1 += h;
        h *= -1;
    }
    let A = createVector(x1, y1);
    let B = createVector(x1 + w, y1);
    let C = createVector(x1 + w, y1 + h);
    let D = createVector(x1, y1 + h);
    let E = createVector(x1 + w / 2, y1 + h / 2);
    let K = createVector(x, y);
    let P = Vector.sub(K, E);
    let ang = P.heading();

    let cornerA = Vector.sub(A, E).heading();
    let cornerB = Vector.sub(B, E).heading();
    let cornerC = Vector.sub(C, E).heading();
    let cornerD = Vector.sub(D, E).heading();
    //console.log(cornerA, cornerB, cornerC, cornerD);

    if (ang >= cornerB || ang <= cornerC) {
        let length = K.y - B.y;
        length = constraint(length, 0, h);
        P = B.copy();
        P.y += length;
    } else if (ang <= cornerB && ang >= cornerA) {
        let length = K.x - A.x;
        length = constraint(length, 0, w);
        P = A.copy();
        P.x += length;
    } else if (ang >= cornerD && ang <= cornerA) {
        let length = K.y - A.y;
        length = constraint(length, 0, h);
        P = A.copy();
        P.y += length;
    } else if (ang <= cornerD && ang >= cornerC) {
        let length = K.x - D.x;
        length = constraint(length, 0, w);
        P = D.copy();
        P.x += length;
    }
    return {
        point: P,
        dist: Vector.dist(P, K)
    }
}
distance.triangle = function () {
    // x, y, x1, y1, x2, y2, x3, y3 arguments needed
    let coll = distance.shape(...arguments);
    return coll;
}
distance.circle = function (x, y, x1, y1, r) {
    let A = createVector(x1, y1);
    let B = createVector(x, y);
    let dst = dist(x, y, x1, y1) - r
    let pt = Vector.add(Vector.sub(A, B).setMag(dst), B);
    return {
        point: pt,
        dist: dst
    }
}
let collision = {};
collision.circleToLine = function (ax, ay, bx, by, cx, cy, cr) {
    let coll = distance.line(ax, ay, bx, by, cx, cy);
    let dst = coll.dist;
    let pt = coll.point;
    if (dst < cr) {
        let C = createVector(cx, cy);
        let space = Vector.sub(C, pt);
        space.setMag(cr);
        let pnt = Vector.add(space, pt);
        return {
            position: pnt,
            collided: true,
            pt: pt
        }

    } else {
        return {
            collided: false
        }
    }
}
distance.line = function (x1, y1, x2, y2, x3, y3) {
    let A = createVector(x1, y1);
    let B = createVector(x2, y2);
    let C = createVector(x3, y3);
    let D = Vector.sub(B, A);
    let Dir = D.heading() + 90; // direction of raycasting
    let Dst = (Vector.sub(A, C).mag() + Vector.sub(B, C).mag()) / 2; //length of raycasting
    let A1 = Vector.sub(C, Vector.AngleToVector(Dir, Dst));
    let B1 = Vector.add(C, Vector.AngleToVector(Dir, Dst));
    //line(A1.x, A1.y, B1.x, B1.y);
    //line(A.x, A.y, C.x, C.y);
    //line(B.x, B.y, C.x, C.y);

    let coll = lineIntersection(A.x, A.y, B.x, B.y, A1.x, A1.y, B1.x, B1.y);
    let t = constraint(coll.t, 0, 1);
    let pos = Vector.add(A, Vector.sub(B, A).mult(t));
    //line(pos.x, pos.y, C.x, C.y);
    return {
        point: pos,
        dist: Vector.dist(pos, C),
        normal: Vector.normal(A, B, C)
    }
}
distance.InfiniteLine = function (x1, y1, x2, y2, x3, y3) {
    let A = createVector(x1, y1);
    let B = createVector(x2, y2);
    let C = createVector(x3, y3);
    let D = Vector.sub(B, A);
    let Dir = D.heading() + 90; // direction of raycasting
    let Dst = (Vector.sub(A, C).mag() + Vector.sub(B, C).mag()) / 2; //length of raycasting
    let A1 = Vector.sub(C, Vector.AngleToVector(Dir, Dst));
    let B1 = Vector.add(C, Vector.AngleToVector(Dir, Dst));
    //line(A1.x, A1.y, B1.x, B1.y);
    //line(A.x, A.y, C.x, C.y);
    //line(B.x, B.y, C.x, C.y);

    let coll = lineIntersection(A.x, A.y, B.x, B.y, A1.x, A1.y, B1.x, B1.y);
    let t = coll.t;
    let pos = Vector.add(A, Vector.sub(B, A).mult(t));
    //line(pos.x, pos.y, C.x, C.y);
    return {
        point: pos,
        dist: Vector.dist(pos, C),
        normal: Vector.normal(A, B, C)
    }
}
distance.shape = function (x, y) {
    let xPositions = [];
    let yPositions = [];
    for (let i = 2; i < arguments.length; i += 2) {
        xPositions.push(arguments[i]);
        yPositions.push(arguments[i + 1]);
    }
    let pt;
    let length = Infinity;

    for (let i = 0; i < xPositions.length - 1; i++) {
        let coll = this.line(xPositions[i], yPositions[i], xPositions[i + 1], yPositions[i + 1], x, y);
        if (coll.dist < length) {
            length = coll.dist;
            pt = coll.point;
        }
    }
    let coll = this.line(xPositions[xPositions.length - 1], yPositions[yPositions.length - 1], xPositions[0], yPositions[0], x, y);
    if (coll.dist < length) {
        length = coll.dist;
        pt = coll.point;
    }
    return {
        dist: length,
        point: pt
    }
}
collision.circleToCircle = function (x1, y1, x2, y2, r1, r2) {
    let space = r1 + r2;
    let distance = mag(x2 - x1, y2 - y1);
    if (distance < space) {
        let nPos = new Vector2(x1, y1).sub(new Vector2(x2, y2)).setMag(space);
        return {
            collided: true,
            position1: new Vector2(x2, y2).add(nPos),
            position2: new Vector2(x1, y1).sub(nPos)
        }
    } else {
        return {
            collided: false
        }
    }
}
collision.circleToRect = function (sx, sy, sw, sh, cx, cy, cr) {
    let c = createVector(cx, cy);
    let coll = distance.rect2(cx, cy, sx, sy, sw, sh);
    if (coll.dist < cr) {
        let pt;
        if (cx > sx && cx < sx + sw && cy > sy && cy < sy + sh) {
            pt = Vector.sub(coll.point, c);
            pt.setMag(coll.dist + cr);
            pt.add(c);
        } else {
            pt = Vector.sub(createVector(cx, cy), coll.point);
            //line(200, 200, 200 + pt.x, 200 + pt.y); debugging
            pt.setMag(cr);
            pt.add(coll.point);
            //line(cx, cy, pt.x, pt.y); debugging
        }
        return {
            position: pt,
            collided: true
        }
    }
    return {
        collided: false
    }
}
distance.rect3 = function (x, y, x1, y1, w, h) {
    if (w < 0) {
        x1 += w;
        w *= -1;
    }
    if (h < 0) {
        y1 += h;
        h *= -1;
    }
    let A = createVector(x1, y1);
    let B = createVector(x1 + w, y1 + h);
    let C = createVector(x, y);
    let D = Vector.min(Vector.max(C, A), B)
    return {
        point: D,
        dist: Vector.dist(D, C)
    };
}
const collided = {
    square: function (a, sz, p) {
        let b = Vector.add(a, createVector(sz, sz));
        if (a.x <= p.x && b.x >= p.x && a.y <= p.y && b.y >= p.y) {
            return true;
        }
    },
    rect: function (a, sx, sy, p) {
        let b = Vector.add(a, createVector(sx, sy));
        if (a.x <= p.x && b.x >= p.x && a.y <= p.y && b.y >= p.y) {
            return true;
        }
    }
};
{
    function image(...args) {
        args[0].crossOrigin = "";
        ctx.drawImage(...args);
    }
    let pushedImages = [];
    function pushImage() {
        pushedImages.push(getImage);
    }
    function getImage() {
        let img = new Image();
        img.src = ctx.canvas.toDataURL();
        return img;
    }
    function createImage(w, h) {
        return new Image(w, h);
    }
    function popImage() {
        ctx.drawImage(pushedImages.pop());
    }
    function copyImage(img, x, y, w, h) {
        pushImage();
        let canva = document.createElement("canvas");
        let ctx2 = canva.getContext("2d");
        ctx2.drawImage(img, x, y, w, h, 0, 0, CanvasWidth, CanvasHeight);
        let img2 = new Image(w, h);
        img2.src = ctx2.canvas.toDataURL();
        //popImage();
        canva.remove();
        return img2;
    }
    function canvasImage(w, h) {
        this.width = w;
        this.height = h;
        this.canvas = document.createElement("canvas");
        this.canvas.width = w;
        this.canvas.height = h;
        this.drawingContext = this.canvas.getContext("2d");
        this.pixelState = this;
        this.imageData = undefined;
        this.loadPixels = function () {
            const imageData = this.drawingContext.getImageData(0, 0, w, h);
            pixelsState._setProperty('imageData', imageData);
            pixelsState._setProperty('pixels', imageData.data);
        };
    }
    let densityVal = 1;
    function pixelDensity(val) {
        if (typeof val == "number") {
            val = 1 / val * window.devicePixelRatio;
            var c = ctx.canvas;
            var w = c.width, h = c.height;
            c.setAttribute('width', w * val);
            c.setAttribute('height', h * val);
            c.style.width = w;
            c.style.height = h;
            ctx.scale(val, val);
            backGround(255);
        } else {
            return densityVal;
        }
    }
    function loadImage(name, width, height, call) {
        var myImage = new Image();
        myImage.src = name;
        if (width && height) {
            myImage.width = width;
            myImage.height = height;
            if (call) {
                myImage.onload = call;
            }
        } else if (width) {
            myImage.onload = width;
        }
        return myImage;
    }
}
{
    class Turtle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.angle = 0;
            //this.fillColor = color(255);
            this.strokeColor = color(255);
            //this.doFill = true;
            this.doStroke = true;
        }
        moveTo(x, y) {
            saveColor();
            //if (this.doFill) {
            //    fill(this.fillColor);
            //} else {
            //    nofill();
            //}
            if (this.doStroke) {
                stroke(this.strokeColor);
            } else {
                noStroke();
            }
            line(this.x, this.y, x, y);
            this.x = x;
            this.y = y;
            loadColor();
        }
        jumpTo(x, y) {
            this.x = x;
            this.y = y;
        }
    }
}
let gizmos = [];
let gizmoSelected = false;
class Gizmos {
    #id;
    selected;
    hovered;
    name;
    size = [];
    shape;
    mouseOffset;
    constructor(x, y, col) {
        this.constraintedA = createVector();
        this.constraintedB = createVector(CanvasWidth, CanvasHeight);
        this.position = createVector(x, y);
        this.constrainted = false;
        this.size = [];
        this.offset = createVector();
        this.size[0] = 10;
        this.shape = GizmoShapes.circle;
        this.selfUpdate = true;
        this.selfDraw = true;
        this.#id = gizmos.length;
        gizmos.push(this);
        this.setColor(col);

        this.name = "";
        this.nameSize = 5 * this.radius;
    }
    setConstraints(a, b) {
        this.constraintedA = a;
        this.constraintedB = b;
    }
    constraintToCircle(c, r) {
        this.position = Vector.limitDistance(c, this.position, r);
    }
    setName(nm) {
        this.name = nm;
    }
    setColor(col) {
        this.col = splitRGB(col);
        this.normalColor = this.col.string();
        this.hoveredColor = this.col.mult(0.90);
        this.clickedColor = this.col.mult(0.80);
    }
    destroy() {
        gizmos.splice(this.#id, 1);
    }
    setPos(pos) {
        this.position = pos;
    }
    update() {
        this.hovered = this.getHoveredInfo();
        if (this.hovered || this.selected) {
            if (!gizmoSelected || this.selected) {
                if (mousePressed) {
                    if (!this.selected) {
                        this.mouseOffset = Vector.sub(mouse, this.position);
                        this.selected = true;
                        gizmoSelected = true;
                        if (this.onclick) {
                            this.onClick();
                        }
                    }
                    this.setPos(Vector.sub(mouse.copy(), this.mouseOffset));
                } else if (this.selected) {
                    this.selected = false;
                    gizmoSelected = false;
                }
            }
        }
        if (this.constrainted) {
            this.position = Vector.constaint(this.position, this.constraintedA, this.constraintedB);
        }
    }
    constraintToLineSeg(a, b) {
        let point = distance.line(a.x, a.y, b.x, b.y, this.position.x, this.position.y);
        ln(point, this.position);
        this.position = point.point;
    }
    draw() {
        saveColor();
        noStroke();
        if (this.selected) {
            //stroke(this.color);
            fill(this.clickedColor);
        } else if (this.hovered) {
            fill(this.hoveredColor);
        } else {
            fill(this.normalColor);
        }
        this.drawShape();
        fill(0);
        if (this.hovered) {
            textSize(this.nameSize);
            text(this.name, this.position.x, this.position.y);
        }
        loadColor();
    }
    drawShape() {
        if (this.shape == GizmoShapes.circle) {
            circle(this.position.x + this.offset.x, this.position.y + this.offset.y, this.size[0]);
        } else if (this.shape == GizmoShapes.square) {
            rect(this.position.x + this.offset.x, this.position.y + this.offset.y, this.size[0], this.size[0]);
        } else if (this.shape == GizmoShapes.rect) {
            rect(this.position.x + this.offset.x, this.position.y + this.offset.y, this.size[0], this.size[1]);
        }
    }
    setShape(shape, ...sizes) {
        if (shape == GizmoShapes.square) {
            this.offset = createVector(-sizes[0] / 2, -sizes[0] / 2);
        } else if (shape == GizmoShapes.rect) {
            this.offset = createVector(-sizes[0] / 2, -sizes[1] / 2);
        } else if (shape == GizmoShapes.circle) {
            this.offset = createVector(0, 0);
        }
        this.size = [...sizes];
        this.shape = shape;
    }
    getHoveredInfo() {
        if (this.shape == GizmoShapes.circle) {
            //console.log(Vector.add(this.position, this.offset));
            return (Vector.dist(Vector.add(this.position, this.offset), mouse) <= this.size[0]);
        } else if (this.shape == GizmoShapes.square) {
            let vec = Vector.add(this.position, this.offset);
            if (collided.square(vec, this.size[0], mouse)) {
                return true;
            }
        }
        return false;
    }
}
const RayCast = {
    Vector: {
        line: function (rs, r, a, b) {
            return RayCast.line(rs.x, rs.y, r.x, r.y, a.x, a.y, b.x, b.y);
        },
        shape: function (origin, dir, ...verts) {
            return RayCast.shape(origin.x, origin.y, dir.x, dir.y, ...Vector.array(...verts));
        },
        rect: function (origin, dir, a, bx, by) {
            return RayCast.rect(origin.x, origin.y, dir.x, dir.y, a.x, a.y, bx, by);
        },
        rect1: function (origin, dir, ax, ay, bx, by) {
            return this.rect(origin.x, origin.y, dir.x, dir.y, createVector(ax, ay), bx, by);
        },
        square: function (origin, dir, a, b) {
            return this.rect(origin, dir, a, b, b);
        },
        square1: function (origin, dir, ax, ay, b) {
            return this.rect(origin, dir, createVector(ax, ay), b, b);
        }
    },
    line: function (rsx, rsy, rx, ry, ax, ay, bx, by) {
        let rs = createVector(rsx, rsy);
        let rd = createVector(rsx + rx, rsy + ry);
        let a = createVector(ax, ay);
        let b = createVector(bx, by);
        let norm = Vector.normal(a, b, rs);
        let ln = lineIntersection(ax, ay, bx, by, rsx, rsy, rsx + rx, rsy + ry);
        if (ln.intersected) {
            return {
                intersected: true,
                point: ln.point,
                normal: norm
            }
        }
        if (ln.t >= 0 && ln.t <= 1 && ln.u >= 0) {
            let pt = Vector.add(a, Vector.mult(Vector.sub(b, a), ln.t));
            if (Vector.dist(pt, rs) > Vector.dist(pt, rd)) {
                return {
                    intersected: true,
                    point: pt,
                    normal: norm
                };
            }
        }
        return {
            intersected: false
        };
    },
    rect: function (origX, origY, dirX, dirY, ax, ay, bx, by) {
        return this.shape(origX, origY, dirX, dirY, ax, ay, ax + bx, ay, ax + bx, ay + by, ax, ay + by);
    },
    square: function (origX, origY, dirX, dirY, ax, ay, b) {
        return this.rect(origX, origY, dirX, dirY, ax, ay, b, b);
    },
    shape: function (originX, originY, dirX, dirY, ...args) {
        let origin = createVector(originX, originY);
        let dir = createVector(dirX, dirY);
        let verts = [];
        for (var i = 0; i < args.length; i += 2) {
            verts.push(createVector(args[i], args[i + 1]));
        }

        for (var vert of verts) {
            circle(vert.x, vert.y, 10);
        }
        let length = Infinity;
        let finalCast = {
            intersected: false
        };
        for (var i = 0; i < verts.length; i++) {
            let a = verts[i];
            let b = verts[(i + 1) % verts.length];
            let cast = this.Vector.line(origin, dir, a, b);
            if (cast.intersected) {
                let len = Vector.dist(origin, cast.point);
                let len2 = Vector.dist(Vector.add(origin, dir), cast.point);
                if (len < length/* && len2 < len*/) {
                    length = len;
                    finalCast = cast;
                }
            }
        }
        return finalCast;
    }
}
class Gizmo2 {
    #id;

    size;

    shape;

    selected;

    hovered;

    name;

    stateChanged;

    hoveredColor;

    hoveredColor2;

    normalColor;

    clickedColor;

    onClick;
    constructor(x, y, col) {
        this.size = [];
        this.offset = createVector();
        this.size[0] = 10;
        this.shape = GizmoShapes.circle;
        this.position = createVector(x, y);
        this.selfUpdate = true;
        this.selfDraw = true;
        this.#id = gizmos.length;
        gizmos.push(this);
        this.setColor(col);
        this.setShape(GizmoShapes.circle, 10);
        this.name = "";
        this.nameSize = 5 * this.size[0];
    }
    setName(nm) {
        this.name = nm;
    }
    setShape(shape, ...sizes) {
        if (shape == GizmoShapes.square) {
            this.offset = createVector(-sizes[0] / 2, -sizes[0] / 2);
        } else if (shape == GizmoShapes.rect) {
            this.offset = createVector(-sizes[0] / 2, -sizes[1] / 2);
        } else if (shape == GizmoShapes.circle) {
            this.offset = createVector(0, 0);
        }
        this.size = [...sizes];
        this.shape = shape;
    }
    getHoveredInfo() {
        if (this.shape == GizmoShapes.circle) {
            //console.log(Vector.add(this.position, this.offset));
            return (Vector.dist(Vector.add(this.position, this.offset), mouse) <= this.size[0]);
        } else if (this.shape == GizmoShapes.square) {
            let vec = Vector.add(this.position, this.offset);
            if (collided.square(vec, this.size[0], mouse)) {
                return true;
            }
        }
        return false;
    }
    setColor(col) {
        let col2 = splitRGB(col);
        this.normalColor = col;
        this.hoveredColor = col2.mult(0.85);
        this.hoveredColor2 = col2.mult(0.85);
        this.clickedColor = col2.mult(0.7);
    }
    setNormalColor(col) {
        let col2 = splitRGB(col);
        this.normalColor = col;
        this.hoveredColor = col2.mult(0.85);
    }
    setSelectedColor(col) {
        let col2 = splitRGB(col);
        this.clickedColor = col;
        this.hoveredColor2 = col2.mult(0.85);
    }
    destroy() {
        gizmos.splice(this.#id, 1);
    }
    update() {
        this.hovered = this.getHoveredInfo();
        if (mousePressed) {
            if (!this.stateChanged && this.hovered) {
                this.selected = !this.selected;
                if (this.onClick) {
                    this.onClick();
                }
                this.stateChanged = true;
            }
        } else {
            this.stateChanged = false;
        }
    }
    draw() {
        saveColor();
        noStroke();
        if (this.selected && this.hovered) {
            fill(this.hoveredColor2);
        } else if (this.selected) {
            fill(this.clickedColor);
        } else if (this.hovered) {
            fill(this.hoveredColor);
            console.log("ok");
        } else {
            fill(this.normalColor);
        }
        //fill(0);
        this.drawShape();
        if (this.hovered) {
            textSize(this.nameSize);
            text(this.name, this.position.x, this.position.y);
        }
        loadColor();

    }
    drawShape() {
        if (this.shape == GizmoShapes.circle) {
            circle(this.position.x + this.offset.x, this.position.y + this.offset.y, this.size[0]);
        } else if (this.shape == GizmoShapes.square) {
            rect(this.position.x + this.offset.x, this.position.y + this.offset.y, this.size[0], this.size[0]);
        } else if (this.shape == GizmoShapes.rect) {
            rect(this.position.x + this.offset.x, this.position.y + this.offset.y, this.size[0], this.size[1]);
        }
    }
}
{
    let savedColor;
    let savedColor2;
    let fls;
    let sls;
    let savedLineWidth;
    function saveColor() {
        savedColor = ctx.fillStyle;
        savedColor2 = ctx.strokeStyle;
        sls = st;
        fls = fl;
    }
    function loadColor() {
        if (savedColor && savedColor2) {
            ctx.fillStyle = savedColor;
            ctx.strokeStyle = savedColor2;
            st = sls;
            fl = fls
        }
    }
    function saveLineWidth() {
        savedLineWidth = ctx.lineWidth;
    }
    function loadLineWidth() {
        if (savedLineWidth) {
            ctx.lineWidth = savedLineWidth;
        }
    }
}