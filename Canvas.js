// #region Misc
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
function downloadCanvasImage() {
    var link = document.createElement('a');
    link.download = 'Canvas_Image.png';
    link.href = ctx.canvas.toDataURL();
    link.click();
}
function print(...message) {
    console.log(...message);
}
{
    let storageTypes = [];
    let suffix = "_ItemType"
    function storeItem(key, item) {
        let type = typeof item;
        if (type == "object") {
            for (var i = 0; i < storageTypes.length; i++) {
                if (item instanceof storageTypes[i].type) {
                    type = storageTypes[i].name;
                    localStorage.setItem(key + suffix, type);
                    break;
                }
            }
        }
        localStorage.setItem(key, JSON.stringify(item));
    }
    function getItem(key) {
        let type = localStorage.getItem(key + suffix);
        let item = JSON.parse(localStorage.getItem(key));
        if (item != null) {
            for (var i = 0; i < storageTypes.length; i++) {
                if (type == storageTypes[i].name) {
                    console.log(item);
                    item = storageTypes[i].parse(...Object.values(item));
                }
            }
        }
        return item;
    }
    function removeItem(key) {
        localStorage.removeItem(key);
        localStorage.removeItem(key + suffix);
    }
    function setStorageItemType(name, type, parse = (...args) => new type(...args)) {
        storageTypes.push({
            name: name,
            type: type,
            parse: parse
        });
    }
    setStorageItemType("Vector2", Vector2);
}
var loadingResources = 0;
function loadFile(url, callback) {
    loadingResources++;
    let request = new XMLHttpRequest();
    //console.log(request);
    request.open("GET", url, true);
    request.onload = function () {
        if (request.status < 200 || request.status > 299) {
            callback("Error: HTTP Status " + request.status + " on resource " + url);
        } else {
            callback(null, request.responseText);
        }
        loadingResources--;
        checkForStart();
    };
    request.send();
    return request;
}
class Event1 {
    bound;
    constructor() {
        this.bound = [];
    }
    bind(func) {
        this.bound.push(func);
    }
    Fire(...args) {
        for (var i = 0; i < this.bound.length; i++) {
            this.bound[i](...args);
        }
    }
    getFire() {
        let ths = this;
        return (...args) => {
            ths.Fire(...args);
        }
    }
}
// #endregion

// #region Vector
class Camera {
    static position = new Vector3(0, 0, -10);
    static update() {
        let forward = new Vector3(0, 0, 1).rotate(this.rotationx, this.rotationy, this.rotationz).mult(-GetAxis("vertical") * this.zSpeed);
        let right = new Vector3(1, 0, 0).rotate(this.rotationx, this.rotationy, this.rotationz).mult(GetAxis("horizontal", "key") * this.xSpeed);
        let angle = GetAxis("horizontal", "arrow") * this.yrotationspeed;
        //console.log(angle);
        this.rotate(0, -angle, 0);
        let up = new Vector3(0, GetAxis("vertical2") * this.ySpeed, 0);
        this.position.add(forward);
        this.position.add(right);
        this.position.add(up);
    }
    static rotate(xr, yr, zr) {
        this.rotationx += xr;
        this.rotationy += yr;
        this.rotationz += zr;
        this.projectionMatrix = Matrices.mult(Rotation.matrix(3, 2, 1, xr), this.projectionMatrix);
        this.projectionMatrix = Matrices.mult(Rotation.matrix(3, 0, 2, yr), this.projectionMatrix);
        this.projectionMatrix = Matrices.mult(Rotation.matrix(3, 0, 1, zr), this.projectionMatrix);
    }
    static xSpeed = 0;
    static ySpeed = 90;
    static zSpeed = 0;
    static yrotationspeed = 2;
    static rotationx = 0;
    static rotationy = 0;
    static rotationz = 0;
    static projectionMatrix = 0;
    static setSpeed(xs, ys, zs) {
        this.xSpeed = xs;
        this.ySpeed = ys;
        this.zSpeed = zs;
    };
    static worldRotation = {
        x: 0,
        y: 0,
        z: 0
    };
    static resetWorldRotation() {
        this.worldRotation = {
            x: 0,
            y: 0,
            z: 0
        }
    }
    static radiusP(r, z) {
        let v1 = new Vector3(0, 0, z);
        let v2 = new Vector3(r, 0, z);
        v1 = v1.persp();
        v2 = v2.persp();
        return Math.abs(v2.x - v1.x); //r / (z - 1);
    }
    static radiusO(r, z) {
        let v1 = new Vector3(0, 0, z);
        let v2 = new Vector3(r, 0, z);
        v1 = v1.ortho();
        v2 = v2.ortho();
        //console.log(v2.array()
        this.zSpeed = zs;
    };
    static worldRotation = {
        x: 0,
        y: 0,
        z: 0
    };
    static resetWorldRotation() {
        this.worldRotation = {
            x: 0,
            y: 0,
            z: 0
        }
    }
    static radiusP(r, z) {
        let v1 = new Vector3(0, 0, z);
        let v2 = new Vector3(r, 0, z);
        v1 = v1.persp();
        v2 = v2.persp();
        return Math.abs(v2.x - v1.x); //r / (z - 1);
    }
    static radiusO(r, z) {
        let v1 = new Vector3(0, 0, z);
        let v2 = new Vector3(r, 0, z);
        v1 = v1.ortho();
        v2 = v2.ortho();
        //console.log(v2.array());
        return r / (z - 1);
    }
}
function rotateX(ang) {
    Camera.worldRotation.x += ang;
}
function rotateY(ang) {
    Camera.worldRotation.y += ang;
}
function rotateZ(ang) {
    Camera.worldRotation.z += ang;
}
const Vector3D = {
    crossProduct: function (v, w) {
        let y = -(v.x * w.z - w.x * v.z);
        return new Vector3(v.y * w.z - v.z * w.y, y, v.x * w.y - w.x * v.y);
    },
    normal: function (a, b, c) {
        a = a.copy().sub(c);
        b = b.copy().sub(c);
        return this.crossProduct(b, a).normalize();
    },
    normal2: function (a, b, c) {
        a = a.copy().sub(c);
        b = b.copy().sub(c);
        return this.crossProduct(b, a);
    },
    avg: function (...vs) {
        let v = new Vector3(0, 0, 0);
        for (var i = 0; i < vs.length; i++) {
            v.add(vs[i]);
        }
        v.div(vs.length || 1);
        return v;
    },
    fromArray: function (...args) {
        let arr = [];
        for (var i = 0; i < args.length; i += 3) {
            arr.push(new Vector3(args[i], args[i + 1], args[i + 2]));
        }
        return arr;
    },
    array: function (...args) {
        let arr = [];
        for (var i = 0; i < args.length; i++) {
            arr.push(...args[i].array());
        }
        return arr;
    }
}
function Vector3(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.copy = function () {
        return new Vector3(this.x, this.y, this.z);
    }
    this.add = function (vec) {
        this.x += vec.x || 0;
        this.y += vec.y || 0;
        this.z += vec.z || 0;
        return this;
    }
    this.neg = function () {
        return new Vector3(-this.x, -this.y, -this.z);
    }
    this.normalize = function () {
        let m = this.mag()
        if (m == 0) {
            m = 1;
        }
        this.div(m);
        return this;
    }
    this.mult = function (t) {
        this.x *= t;
        this.y *= t;
        this.z *= t;
        return this;
    }
    this.div = function (t) {
        this.mult(1 / t);
        return this;
    }
    this.mag = function () {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }
    this.setMag = function (m) {
        this.normalize().mult(m);
        return this;
    }
    this.sub = function (vec) {
        //console.log(vec);
        this.add(vec.neg());
        return this;
    }
    this.array = function () {
        return [this.x, this.y, this.z];
    }
    this.matrix = function () {
        return new Matrix(1, 4, [...this.array(), 1]);
    }
    this.transform = function (mat1) {
        //console.log(mat1, this.matrix());
        let mat = Matrices.mult(mat1, this.matrix());
        //console.log(mat1.array, mat.array);
        let arr = mat.array;
        this.x = arr[0];
        this.y = arr[1];
        this.z = arr[2];
        return this;
    }
    this.rotationX = function () {
        let vec = new Vector2(this.z, this.y);
        let ang = vec.heading();
        vec.rotate(-ang);
        return ang;
    }
    this.Vector2 = function () {
        return new Vector2(this.x, this.y);
    }
    this.rotated = function (ax, ay, az) {
        let v = this.copy();
        v.rotate(ax, ay, az);

        return v;
    }
    this.rotate = function (ax, ay, az, log = false) {
        let mat = Matrices.rotation3(ax, ay, az);
        if (log) {
            console.log(this.array());
            console.log(mat.array);
        }
        this.transform(mat);
        if (log) {
            console.log(this.array());
        }
        return this;
    }
    this.persp = function () {
        let vec = this.fromCamera();
        let z = 1 / (vec.z);
        if (z <= 0) {
            z *= -1;
            z *= CanvasWidth;
        }
        let projmat = new Matrix(4, 4, [
            z, 0, 0, 0,
            0, z, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        let mat = Matrices.mult(projmat, vec.matrix()).array;
        return new Vector3(mat[0], mat[1], mat[2]);
    }
    this.fromCamera = function () {
        let vec = this.copy();
        vec.rotate(-Camera.worldRotation.x, -Camera.worldRotation.y, -Camera.worldRotation.z);
        vec.sub(Camera.position);
        vec.rotate(360 - Camera.rotationx, 360 - Camera.rotationy, 360 - Camera.rotationz);
        return vec;
    }
    this.ortho = function () {
        let vec = this.copy();
        vec.rotate(-Camera.worldRotation.x, -Camera.worldRotation.y, -Camera.worldRotation.z);
        vec.sub(Camera.position);
        let projmat = Camera.projectionMatrix;
        let mat = Matrices.mult(projmat, vec.matrix()).array;
        return new Vector3(mat[0], mat[1], mat[2]);
    }
    this.index = function () {
        return parseInt(this.x) + ":" + parseInt(this.y) + ":" + parseInt(this.z);
    }
    //console.log(this.ortho());
}
function createVector(x = 0, y = 0) {
    return new Vector2(x, y);
}
function createVector3(x = 0, y = 0, z = 0) {
    return new Vector3(x, y, z);
}
const Vector = {
};
Vector.fromIndex = function (str) {
    let arr = str.split(":");
    let x = arr[0];
    let y = arr[1];
    let z = arr[2];
    return new Vector3(x, y, z);
}
Vector.array = function (...vecs) {
    let ans = [];
    for (var vec of vecs) {
        ans.push(...vec.array());
    }
    return ans;
}
var MouseOffset = new Vector2();
Vector.crossProduct = function (a, b) {
    return a.x * b.y - b.x * a.y;
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
Vector.fromArray = function (...verts) {
    let arr = [];
    for (var i = 0; i < verts.length; i += 2) {
        arr.push(createVector(verts[i], verts[i + 1]));
    }
    return arr;
}
Vector.InSquare = function (a, b, p) {
    if (p.x >= a.x && p.y >= a.y && p.x <= b.x && p.y <= b.y) {
        return true;
    }
    return false
}
Vector.fromOrigin = {
    farthest: function (o, arr) {
        let len = 0;
        let pt;
        let li;
        for (var i = 0; i < arr.length; i++) {
            let d = Vector.dist(arr[i], o);
            if (d > len) {
                pt = arr[i].copy();
                len = d;
                li = i;
            }
        }
        return [pt, li];
    },
    nearest: function (o, arr) {
        let len = Infinity;
        let pt;
        let li;
        for (var i = 0; i < arr.length; i++) {
            let d = Vector.dist(arr[i], o);
            if (d < len) {
                pt = arr[i].copy();
                len = d;
                li = i;
            }
        }
        return [pt, li];
    }
};
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
Vector.normal2 = function (a, b, c) {
    let ao = Vector.sub(a, b);
    let co = Vector.sub(c, b);
    let aoh = ao.heading();
    let coh = co.heading();
    let mid = avg(aoh, coh);
    mid += 180;
    return Vector.AngleToVector(mid, 1);
}
Vector.reflect = function (v, n) {
    let vn = v.neg();
    let d = Vector.dot(vn, n) / n.mag();
    //console.log(v, n, d);
    let p = n.copy().setMag(d);
    let dp = Vector.sub(p, vn);
    let vr = Vector.add(p, dp);
    return vr;

}
Vector.copy = function (vec) {
    if (vec instanceof Vector3) {
        return new Vector3(vec.x, vec.y, vec.z);
    }
    return new Vector2(vec.x, vec.y);
}
Vector.side = function (a, b, p) {
    let mid = Vector.mid(a, b);
    let b2 = Vector.sub(b, mid);
    b2.rotate(90);
    let po = Vector.sub(p, mid);

    let prod = Vector.dot(po, b2) / b2.mag();
    if (prod >= 0) {
        return 90;
    } else {
        return -90;
    }
}
Vector.normal = function (a, b, p) {
    let rot = Vector.side(a, b, p);
    let c = Vector.DirectionVector(a, b);
    c.rotate(rot);
    return c;
}
Vector.constraint = function (p, a, b) {
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
    vec = vec.copy().mult(m);
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
    return Vector.copy(vec);
}
Vector.sub = function (a, b) {
    return Vector.copy(a.copy().sub(b));
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
Vector.dot = function (v, v2) {
    if (v instanceof Vector3) {
        //console.log(v.x * v2.x + v.y * v2.y + v.z * v2.z);
        return v.x * v2.x + v.y * v2.y + v.z * v2.z;
    }
    return v.x * v2.x + v.y * v2.y;
}
Vector.AngleToVector = function (ang, rad = 1) {
    let x = rad * cos(ang);
    let y = rad * sin(ang);
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
Vector.dist = function (a, b) {
    //console.log(a, b);
    return b.copy().sub(a).mag();
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
    this.rotate = function (ang) {
        this.transform2(Matrices.rotation2(ang).array);
        return this;
    }
    this.set = function (nx, ny) {
        this.x = nx;
        this.y = ny;
        return this;
    }
    this.transform2 = function (mat) {
        let nV = Matrices.transform2t2(this, mat);
        this.set(nV.x, nV.y);
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
        this.div(this.mag() | 1);
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
    this.index = function () {
        return parseInt(this.x) + ":" + parseInt(this.y);
    }
}

// #endregion

// #region Input
var mouse = new Vector2(0, 0);
var mouse2 = new Vector2(0, 0);
{
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        //console.log(Canvas.x(event.clientX), event.clientY, Canvas.xo1);
        let x = Canvas.xi(event.clientX);
        let y = Canvas.yi(event.clientY);
        mouse.set(x, y);
        mouse2.set(event.clientX, event.clientY);
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
    let Axii = {
        horizontal: new Axis(key.right, key.left, "d", "a", "arrow", "key"),
        vertical: new Axis(key.down, key.up, "s", "w", "arrow", "key"),
        vertical2: new Axis("q", "e")
    };
    function setAxis(name, pos, neg, altP = pos, altN = neg, Nm = "both", altNm = "both") {
        Axii[name] = new Axis(pos, neg, altP, altN, Nm, altNm);
    }
    function Axis(pos, neg, altP = pos, altN = neg, Nm = "both", altNm = "both") {
        this.pos = pos;
        this.neg = neg;
        this.altP = altP;
        this.altN = altN;
        this.Nm = Nm;
        this.altNm = altNm;
    }
    function GetAxis(TAxis, TKey = "both") {
        let axis = Axii[TAxis];
        if (TKey == axis.Nm || TKey == "both") {
            if (pressedKeys[axis.neg])
                return -1;
            if (pressedKeys[axis.pos])
                return 1;
        }
        if (TKey == axis.altNm || TKey == "both") {
            //console.log(axis.altN);
            if (pressedKeys[axis.altN])
                return -1;
            if (pressedKeys[axis.altP])
                return 1;
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
const RGB = 0;
const HSB = 1;
const HSL = 2;
const TEXT = {};
TEXT.CENTER = "center";
TEXT.MIDDLE = "middle";
TEXT.RIGHT = "right";
TEXT.LEFT = "left";
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
const AngleModes = {
    radians: 0,
    degrees: 1
};
// #endregion

// #region Control
const Time = {
    deltaTime: 0,
    frameRate: 0,
    time: 0
}
var frameNo = 0;
autoStartLoop = true;
var UnSetFps = true;
let drawIntervalId;
let animationFrameLoopId;
var setupEvent = new Event1();
{
    var settedUP = false;
    var loaded = false;
    function checkForStart() {
        if (!(loadingResources > 0) && !settedUP && loaded) {
            settedUP = true;
            setupEvent.Fire();
            if (window.setUp) {
                setUp();
            }
            if (autoStartLoop) {
                requestAnimationFrame(redraw);
            }
        }
    }
}
document.body.onload = function () {
    loaded = true;
    checkForStart();
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
    autoStartLoop = false;
    if (UnSetFps) {
        loopGoing = false;
        cancelAnimationFrame(animationFrameLoopId);
    }
    if (!UnSetFps) {
        clearInterval(drawIntervalId);
    }
}
function loop() {
    autoStartLoop = true;
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
        Camera.update();
        if (Canvas.enabled) {
            //ctx.scale(pixelDensity(), pixelDensity());
            Gizmo2.update()
            Gizmo.update();
            ctx.save();
        }
        draw();
        if (Canvas.enabled) {
            saveColor();
            ctx.restore();
            loadColor();
            Gizmo2.draw();
            Gizmo.draw();
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
// interval stuff
// #endregion

// #region Math
const Intersection = {
    LTL: function (ax, ay, bx, by, cx, cy, dx, dy) {
        let inti = lineIntersection(ax, ay, bx, by, cx, cy, dx, dy);
        if (inti.intersected) {
            //console.log(inti.point);
            return inti.point;
        }
    },
    ILTL: function (ax, ay, bx, by, cx, cy, dx, dy) {
        let inti = lineIntersection(ax, ay, bx, by, cx, cy, dx, dy);
        if (inti.intersected) {
            //console.log(inti.point);
            return inti.point;
        } else if (inti.u <= 1 && inti.u >= 0) {
            let pt = Vector.interpolate(new Vector2(ax, ay), new Vector2(bx, by), inti.t);
            if (Boolean(pt.x)) {
                return pt;
            } else {
                console.log(pt);
            }
        }
    },
    ILTS: function (ax, ay, bx, by, verts) {
        let vs = Shapes.shape.vertices.get(verts);
        let pts = [];
        for (var i = 0; i < vs.length; i++) {
            let ci = i;
            let di = (i + 1) % vs.length;
            let c = vs[ci];
            let d = vs[di];
            let inti = this.ILTL(ax, ay, bx, by, c.x, c.y, d.x, d.y);
            if (inti) {
                pts.push(inti);
            }
        }
        return pts;
    },
    LTS: function (ax, ay, bx, by, verts) {
        let vs = Shapes.shape.vertices.get(verts);
        let pts = [];
        for (var i = 0; i < vs.length; i++) {
            let ci = i;
            let di = (i + 1) % vs.length;
            let c = vs[ci];
            let d = vs[di];
            let inti = this.LTL(ax, ay, bx, by, c.x, c.y, d.x, d.y);
            if (inti) {
                pts.push(inti);
            }
        }
        return pts;
    },
    STS: function (verts, verts2) {
        let pts = [];
        for (var i = 0; i < verts.length; i += 2) {
            let ai = (i / 2);
            let bi = (i / 2 + 1) % (verts.length / 2);
            let ax = verts[ai * 2];
            let ay = verts[ai * 2 + 1];
            let bx = verts[bi * 2];
            let by = verts[bi * 2 + 1];
            pts.push(...this.LTS(ax, ay, bx, by, verts2));
        }
        return pts;
    },
    LTR: function (ax, ay, bx, by, rx, ry, w, h) {
        let verts = Shapes.rect.vertices.get2(rx, ry, w, h);

        return this.LTS(ax, ay, bx, by, verts);
    },
    ILTR: function (ax, ay, bx, by, rx, ry, w, h) {
        let verts = Shapes.rect.vertices.get2(rx, ry, w, h);

        return this.ILTS(ax, ay, bx, by, verts);
    },
    RTR: function (ax, ay, aw, ah, bx, by, bw, bh) {
        let verts = Shapes.rect.vertices.get2(ax, ay, aw, ah);
        let verts1 = Shapes.rect.vertices.get2(bx, by, bw, bh);
        return this.STS(verts, verts1);
    },
    CTL: function (ax, ay, bx, by, cx, cy, r) {
        let verts = Shapes.circle.vertices.get2(cx, cy, r);

        return this.LTS(ax, ay, bx, by, verts);
    },
    CTC: function (ax, ay, ar, bx, by, br) {
        let verts = Shapes.circle.vertices.get2(ax, ay, ar);
        let verts1 = Shapes.circle.vertices.get2(bx, by, br);
        return this.STS(verts, verts1);
    }
};
Object.freeze(Intersection);
function CartesianToBarycentric(p, a, b, c) {
    let den = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
    let x1 = a.x, x2 = b.x, x3 = c.x, y1 = a.y, y2 = b.y, y3 = c.y, x = p.x, y = p.y;
    let w1 = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / den;
    let w2 = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / den;
    let w3 = 1 - w1 - w2;
    return [w1, w2, w3];
}
function PointInTriangle(p, a, b, c) {
    let cp1 = Vector3D.normal2(p, a, b);
    let cp2 = Vector3D.normal2(p, b, c);
    let cp3 = Vector3D.normal2(p, c, a);
    if (Vector.dot(cp2, cp1) < 0.0) {
        return false;
    }
    if (Vector.dot(cp2, cp3) < 0.0) {
        return false;
    }
    return true;
}
function sphereCast(ox, oy, oz, rx, ry, rz, cx, cy, cz, cr) {
    let orig = createVector3(ox, oy, oz);
    let dir = createVector3(rx, ry, rz);
    let cv = createVector3(cx, cy, cz);
    //orig.sub(cv);
    ox -= cx;
    oy -= cy;
    oz -= cz;
    let a = Vector.dot(dir, dir);
    let b = 2 * Vector.dot(dir, orig);
    let c = Vector.dot(orig, orig) - cr ** 2;
    let eq = QuadraticFormula(a, b, c);
    let arr = [];
    for (var i = 0; i < eq.length; i++) {
        if (eq[i] >= 0) {
            //console.log(eq[i]);
            let p = orig.copy().add(dir.copy().mult(eq[i]));
            arr.push(p);
        }
    }
    return arr;
}
function linePlaneIntersection(av, bv, af, bf, cf) {
    let eq = getPlaneEq(af, bf, cf);
    let a = eq[0];
    let b = eq[1];
    let c = eq[2];
    let d = eq[3];
    let t = (-a * av.x - b * av.y - c * av.z + d) / (a * bv.x + b * bv.y + c * bv.z);
    //console.log(t);
    let p = av.copy().add(bv.copy().mult(t));

    return p;
}
function PlaneCast(av, bv, af, bf, cf) {
    let eq = getPlaneEq(af, bf, cf);
    let a = eq[0];
    let b = eq[1];
    let c = eq[2];
    let d = eq[3];
    let t = (-a * av.x - b * av.y - c * av.z + d) / (a * bv.x + b * bv.y + c * bv.z);
    if (t >= 0) {
        let p = av.copy().add(bv.copy().mult(t));
        return p;
    }
}
function RaycastFace(av, bv, af, bf, cf) {
    //console.log(af, bf, cf);
    let cast = linePlaneIntersection(av, bv, af, bf, cf);
    if (cast && PointInTriangle(cast, af, bf, cf)) {
        return cast;
    }
}
function getPlaneEq(p, q, r) {
    //console.log(p, q, r);
    let a1 = Vector.sub(q, p);
    let b1 = Vector.sub(r, p);
    let norm = Vector3D.crossProduct(a1, b1);
    let a = norm.x;
    //console.log(a);
    let b = norm.y;
    let c = norm.z;
    let d = a * q.x + b * q.y + c * q.z;
    return [a, b, c, d];
}
function floorDiv(n, d) {
    return floor(n / d);
}
function QuadraticFormula(a, b, c) {
    let disc = b ** 2 - 4 * a * c;
    if (disc < 0) return [];
    let s1 = (-b + disc ** 0.5) / (2 * a);
    if (disc == 0) return [s1];
    if (disc > 0) {
        let s2 = (-b - (disc ** 0.5)) / (2 * a);
        return [s1, s2];
    }
    return [];
}
function sqrt(n) {
    return n ** 0.5;
}
function avg(...ns) {
    let n = ArrayMath.number(ns);
    n /= ns.length;
    return n;
}
function round(n, r = 1) {
    return Math.round(n / r) * r;
}
const mod = {
    neut: function (n, modu) {
        return n % modu;
    },
    pos: function (n, modu) {
        return ((n % modu) + modu) % modu;
    },
    neg: function (n, modu) {
        return ((n % modu) - modu) % modu;
    },
}
function sin(ang) {
    return Math.sin(getAngle(ang));
}
function cos(ang) {
    return Math.cos(getAngle(ang));
}
function getAngle(ang) {
    if (Canvas.AngleMode == AngleModes.degrees) {
        return radians(ang);
    } else {
        return ang;
    }
}
function AngleMode(mode) {
    Canvas.AngleMode = mode;
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
function abs(n) {
    return Math.abs(N);
}
const distance = {
    Vector: {
        rect: function (p, a, w, h) {
            return distance.rect(p.x, p.y, a.x, a.y, w, h);
        },
        triangle: function () {
            return distance.triangle(...Vector.array(...arguments));
        },
        shape: function () {
            return distance.shape(...Vector.array(...arguments));
        },
        circle: function (p, a, r) {
            return distance.circle(p.x, p.y, a.x, a.y, r);
        },
        Infiniteline: function (a, b, p) {
            let bo = Vector.sub(b, a);
            let po = Vector.sub(p, a);
            let prod = Vector.dot(po, bo) / bo.mag();
            let pt = Vector.add(Vector.setMag(bo, prod), a)
            return {
                point: pt,
                dist: Vector.dist(p, pt),
                t: prod / bo.mag(),
                normal: Vector.normal(a, b, p)
            };
        },
        line: function (a, b, p) {
            let bo = Vector.sub(b, a);
            let po = Vector.sub(p, a);
            let prod = constraint(Vector.dot(po, bo) / bo.mag(), 0, bo.mag());
            let pt = Vector.add(Vector.setMag(bo, prod), a)
            return {
                point: pt,
                dist: Vector.dist(p, pt),
                t: prod / bo.mag(),
                normal: Vector.normal(a, b, p)
            };
        },
        line3d: function (a, b, p) {
            let bo = Vector.sub(b, a);
            let po = Vector.sub(p, a);
            let prod = constraint(Vector.dot(po, bo) / bo.mag(), 0, bo.mag());
            let pt = Vector.add(bo.copy().setMag(prod), a)
            return {
                point: pt,
                dist: Vector.dist(p, pt),
                t: prod / bo.mag()
            };
        }
    },
    line: function (ax, ay, bx, by, px, py) {
        return this.Vector.line(createVector(ax, ay), createVector(bx, by), createVector(px, py));
    },
    rect: function (x, y, x1, y1, w, h) {
        if (w < 0) {
            w *= -1;
            x1 -= w;
        }
        if (h < 0) {
            h *= -1;
            y1 -= h;
        }
        let A = createVector(x1, y1);
        let B = createVector(x1 + w, y1);
        let C = createVector(x1 + w, y1 + h);
        let D = createVector(x1, y1 + h);
        let d = distance.shape(x, y, A.x, A.y, B.x, B.y, C.x, C.y, D.x, D.y);
        //console.log(d);
        return d;
    },
    triangle: function () {
        // x, y, x1, y1, x2, y2, x3, y3 arguments needed
        let coll = distance.shape(...arguments);
        return coll;
    },
    circle: function (x, y, x1, y1, r) {
        let A = createVector(x1, y1);
        let B = createVector(x, y);
        let dst = dist(x, y, x1, y1) - r
        let pt = Vector.add(Vector.sub(A, B).setMag(dst), B);
        return {
            point: pt,
            dist: Math.abs(dst),
        }
    },
    InfiniteLine: function (x1, y1, x2, y2, x3, y3) {
        return this.Vector.Infiniteline(createVector(x1, y1), createVector(x2, y2), createVector(x3, y3));
    },
    shape: function (x, y, ...args) {
        let ps = Vector.fromArray(...args);
        let pt;
        let length = Infinity;
        let norm;
        for (let i = 0; i < ps.length; i++) {
            let ai = i;
            let bi = (i + 1) % ps.length;
            let coll = this.line(ps[ai].x, ps[ai].y, ps[bi].x, ps[bi].y, x, y);
            if (coll.dist < length) {
                //console.log(coll);
                length = coll.dist;
                pt = coll.point;
                norm = coll.normal;
            }
        }
        return {
            dist: length,
            point: pt,
            normal: norm
        }
    },

}
Object.freeze(distance);
const collision = {
    circleToLine: function (ax, ay, bx, by, cx, cy, cr) {
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
    },
    circleToCircle: function (x1, y1, x2, y2, r1, r2) {
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
    },
    circleToRect: function (sx, sy, sw, sh, cx, cy, cr) {
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

};
const Between = {
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
Object.freeze(Between);
const RayCast = {
    farthest: {
        Vector: {
            shape: function (origin, dir, ...verts) {
                return RayCast.farthest.shape(origin.x, origin.y, dir.x, dir.y, ...Vector.array(...verts));
            },
            rect: function (origin, dir, a, bx, by) {
                return RayCast.farthest.rect(origin.x, origin.y, dir.x, dir.y, a.x, a.y, bx, by);
            },
            rect1: function (origin, dir, ax, ay, bx, by) {
                return this.rect(origin.x, origin.y, dir.x, dir.y, createVector(ax, ay), bx, by);
            },
            square: function (origin, dir, a, b) {
                return this.rect(origin, dir, a, b, b);
            },
            square1: function (origin, dir, ax, ay, b) {
                return this.rect(origin, dir, createVector(ax, ay), b, b);
            },
            circle: function (o, r, c, rad) {
                return RayCast.farthest.circle(o.x, o.y, r.x, r.y, c.x, c.y, rad);
            }

        },
        rect: function (origX, origY, dirX, dirY, ax, ay, bx, by) {
            return this.shape(origX, origY, dirX, dirY, ax, ay, ax + bx, ay, ax + bx, ay + by, ax, ay + by);
        },
        shape: function (originX, originY, dirX, dirY, ...args) {
            let origin = createVector(originX, originY);
            let dir = createVector(dirX, dirY);
            let verts = [];
            for (var i = 0; i < args.length; i += 2) {
                verts.push(createVector(args[i], args[i + 1]));
            }

            let finalCast = {
                intersected: false
            };
            var len = 0;
            for (var i = 0; i < verts.length; i++) {
                let a = verts[i];
                let b = verts[(i + 1) % verts.length];
                let cast = RayCast.Vector.line(origin, dir, a, b);
                if (cast.intersected) {
                    let d = Vector.dist(origin, cast.point);
                    if (d > len) {
                        len = d;
                        finalCast = cast;
                    }
                }
            }
            return finalCast;
        },
        square: function (origX, origY, dirX, dirY, ax, ay, b) {
            return this.rect(origX, origY, dirX, dirY, ax, ay, b, b);
        },
        circle: function (ox, oy, rx, ry, cx, cy, cr) {
            let o = createVector(ox, oy);
            ox -= cx;
            oy -= cy;
            let a = rx ** 2 + ry ** 2;
            let b = 2 * ox * rx + 2 * oy * ry;
            let c = ox ** 2 + oy ** 2 - cr ** 2;
            let eq = QuadraticFormula(a, b, c);
            let len = I0;
            let pt;
            let n;
            for (var i = 0; i < eq.length; i++) {
                if (eq[i] >= 0) {
                    let x = cx + ox + rx * eq[i];
                    let y = cy + oy + ry * eq[i];
                    let p = createVector(x, y);
                    let d = Vector.dist(p, o);
                    if (d > len) {
                        len = d;
                        pt = p;
                        n = Vector.sub(pt, new Vector2(cx, cy)).normalize();
                    }
                }
            }
            if (pt) {
                return {
                    intersected: true,
                    point: pt,
                    normal: n
                };
            }
            return {
                intersected: false
            };
        }
    },
    v2: {
        Vector: {
            shape: function (origin, dir, ...verts) {
                //console.log(...Vector.array(...verts));
                return RayCast.v2.shape(origin.x, origin.y, dir.x, dir.y, ...Vector.array(...verts));
            },
            rect: function (origin, dir, a, bx, by) {
                return RayCast.v2.rect(origin.x, origin.y, dir.x, dir.y, a.x, a.y, bx, by);
            },
            rect1: function (origin, dir, ax, ay, bx, by) {
                return this.rect(origin.x, origin.y, dir.x, dir.y, createVector(ax, ay), bx, by);
            },
            square: function (origin, dir, a, b) {
                return this.rect(origin, dir, a, b, b);
            },
            square1: function (origin, dir, ax, ay, b) {
                return this.rect(origin, dir, createVector(ax, ay), b, b);
            },
            circle: function (o, r, c, rad) {
                return RayCast.v2.circle(o.x, o.y, r.x, r.y, c.x, c.y, rad);
            }

        },
        rect: function (origX, origY, dirX, dirY, ax, ay, bx, by) {
            return this.shape(origX, origY, dirX, dirY, ax, ay, ax + bx, ay, ax + bx, ay + by, ax, ay + by);
        },
        shape: function (originX, originY, dirX, dirY, ...args) {
            let origin = createVector(originX, originY);
            //line(originX, originY, originX + dirX * 50, originY + dirY * 50);
            let dir = createVector(dirX, dirY);
            let verts = [];
            for (var i = 0; i < args.length; i += 2) {
                verts.push(createVector(args[i], args[i + 1]));
            }

            //for (var vert of verts) {
            //    circle(vert.x, vert.y, 10);
            //}
            let finalCast = {
                intersected: false,
                points: [],
                normals: []
            };
            for (var i = 0; i < verts.length; i++) {
                let a = verts[i];
                let b = verts[(i + 1) % verts.length];
                let cast = RayCast.Vector.line(origin, dir, a, b);
                if (cast.intersected) {
                    finalCast.intersected = true;
                    finalCast.points.push(cast.point);
                    finalCast.normals.push(cast.normal);
                }
            }
            return finalCast;
        },
        square: function (origX, origY, dirX, dirY, ax, ay, b) {
            return this.rect(origX, origY, dirX, dirY, ax, ay, b, b);
        },
        circle: function (ox, oy, rx, ry, cx, cy, r) {
            let c = new Vector2(cx, cy);
            let perimeter = 2 * PI * r;
            let vertices = [];
            for (var i = 0; i <= perimeter; i += 0.25) {
                let angle = map(i, 0, perimeter, 0, 360);
                let vert = Vector.add(c, Vector.AngleToVector(angle, r));
                vertices.push(...vert.array());
            }
            let cast = RayCast.v2.shape(ox, oy, rx, ry, ...vertices);
            return cast;
        }
    },

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
        },
        circle: function (o, r, c, rad) {
            return RayCast.circle(o.x, o.y, r.x, r.y, c.x, c.y, rad);
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
        if (ln.t >= 0 && ln.t <= 1 && ln.u > 0) {
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
        //line(originX, originY, originX + dirX * 50, originY + dirY * 50);
        let dir = createVector(dirX, dirY);
        let verts = [];
        for (var i = 0; i < args.length; i += 2) {
            verts.push(createVector(args[i], args[i + 1]));
        }

        //for (var vert of verts) {
        //    circle(vert.x, vert.y, 10);
        //}
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
    },
    circle: function (ox, oy, rx, ry, cx, cy, r) {
        let c = new Vector2(cx, cy);
        let perimeter = 2 * PI * r;
        let vertices = [];
        for (var i = 0; i <= perimeter; i += 0.25) {
            let angle = map(i, 0, perimeter, 0, 360);
            let vert = Vector.add(c, Vector.AngleToVector(angle, r));
            vertices.push(...vert.array());
        }
        let cast = RayCast.shape(ox, oy, rx, ry, ...vertices);
        return cast;
    }
}
Object.freeze(RayCast);
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
function circleLineIntersection(ox, oy, rx, ry, cx, cy, cr) {
    ox -= cx;
    oy -= cy;
    let a = rx ** 2 + ry ** 2;
    let b = 2 * ox * rx + 2 * oy * ry;
    let c = ox ** 2 + oy ** 2 - cr ** 2;
    let eq = QuadraticFormula(a, b, c);
    let arr = [];
    for (var i = 0; i < eq.length; i++) {
        if (eq[i] >= 0) {
            let x = cx + ox + rx * eq[i];
            let y = cy + oy + ry * eq[i];
            let p = createVector(x, y);
            arr.push(p);
        }
    }
    return arr;
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
function lineIntersection2(ax, ay, bx, by, cx, cy, dx, dy) {
    let eq1 = getLineEq(ax, ay, bx, by);
    let eq2 = getLineEq(cx, cy, dx, dy);
    let a1 = eq1[0];
    let b1 = eq1[1];
    let c1 = eq1[2];
    let a2 = eq2[0];
    let b2 = eq2[1];
    let c2 = eq2[2];

    let den = a1 * b2 - a2 * b1;
    let x = (b2 * c1 - b1 * c2) / den;
    let y = (a1 * c2 - a2 * c1) / den;
    circle(x, y, 5);
    //console.log(x, y, den);
}
function getLineEq(ax, ay, bx, by) {
    let a = by - ay;
    let b = ax - bx;
    let lcm = HCF(a, b);
    //console.log(lcm);
    a /= lcm;
    b /= lcm;
    //bx /= lcm;
    //by /= lcm;
    let c = a * bx + b * by;
    //console.log(a * bx + b * by, a * bx );
    return [a, b, c];
}
function HCF(no1, no2) {
    let factors1 = primeFactors(no1);
    if (no1 < 0) {
        factors1 = [-1];
        no1 = no1 * -1;
        factors1.push(...primeFactors(no1));
    }
    //console.log(factors1);
    let factors2 = primeFactors(no2);
    if (no2 < 0) {
        factors2 = [-1];
        no2 = no2 * -1;
        factors2.push(...primeFactors(no2));
    }
    //console.log(no2);
    //console.log(factors2);
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
function min(...args) {
    return Math.min(...args);
}
function max(...args) {
    return Math.max(...args);
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
const Shapes = {
    line: {
        vertices: {
            get: function (ax, ay, bx, by) {
                return [createVector(ax, ay), createVector(bx, by)];
            },
            get2: function (a, b) {
                return [a.x, a.y, b.x, b.y];
            },
            points: function (ax, ay, bx, by, res = 1) {
                let a = createVector(ax, ay);
                let b = createVector(bx, by);
                let dist = Vector.dist(a, b);
                let off = 0;
                if (dist % res == 0) {
                    off = -1;
                }
                let vs = [];
                res = parseInt(res);
                for (var i = 0; i < dist + off; i += res) {
                    vs.push(Vector.interpolate(a, b, i / dist));
                }
                vs.push(b.copy());
                return vs;
            }
        }
    },
    circle: {
        vertices: {
            get: function (x, y, r, res = 1) {
                let times = this.perimeter(r);
                let o = createVector(x, y);
                let vs = [];
                for (var i = 0; i < times; i += res) {
                    let v = Vector.add(o, Vector.AngleToVector(map(i, 0, times, 0, 360)));
                    vs.push(v);
                }
                return vs;
            },
            get2: function (x, y, r, res = 1) {
                let vs = this.get(x, y, r, res);
                let verts = Shapes.shape.vertices.get2(vs);
                return verts;
            },
            rotate: function (ox, oy, ang, x, y, r, res = 1) {
                let vs = this.get(x, y, r, res);
                let o = createVector(ox, oy);
                for (var v of vs) {
                    v.sub(o).rotate(ang).add(o);
                }
                return Shapes.shape.vertices.get2(vs);
            },
            points: function (x, y, r, res = 1) {
                return this.get(x, y, r, res);
            }
        },
        perimeter: {
            get: function (r) {
                return 2 * Math.PI * r;
            },
            point: function (l, x, y, r, res = 1) {
                let verts = Shapes.circle.vertices.get2(x, y, r, res);
                return Shapes.shape.perimeter.point(l, verts);
            },
            interpolate: function (t, x, y, r, res = 1) {
                t *= this.get(r);
                return this.point(t, x, y, r, res);
            }
        }
    },
    rect: {
        vertices: {
            get: function (x, y, w, h) {
                let vs = [
                    createVector(x, y),
                    createVector(x + w, y),
                    createVector(x + w, y + h),
                    createVector(x, y + h)
                ];
                return vs;
            },
            get2: function (x, y, w, h) {
                let vs = this.get(x, y, w, h);
                let verts = Shapes.shape.vertices.get2(vs);
                return verts;
            },
            rotate: function (ox, oy, ang, x, y, w, h) {
                let vs = this.get(x, y, w, h);
                let o = createVector(ox, oy);
                for (var v of vs) {
                    v.sub(o).rotate(ang).add(o);
                }
                return Shapes.shape.vertices.get2(vs);
            },
            points: function (x, y, w, h, res = 1) {
                let verts = this.get(x, y, w, h);
                let vs = Shapes.shape.vertices.points(verts, res);
                return vs;
            }
        },
        perimeter: {
            get: function (w, h) {
                return 2 * w + 2 * h;
            },
            point: function (l, x, y, w, h) {
                let verts = Shapes.rect.vertices.get2(x, y, w, h);
                return Shapes.shape.perimeter.point(l, verts);
            },
            interpolate: function (t, x, y, w, h) {
                t *= this.get(w, h);
                return this.point(t, x, y, w, h);
            }
        }
    },
    shape: {
        forPixel: function (func, res = 1, ...vs) {
            let o = splitArray(vs);
            let mny = floor(min(...o.y), res) - res;
            let mxy = floor(max(...o.y), res) + res;
            for (var y = mny; y < mxy; y += res) {
                let or = createVector(-500, y);
                let r = createVector(100, 0);
                let cast = RayCast.v2.Vector.shape(or, r, ...vs);
                if (cast.points.length > 0) {
                    let o2 = splitArray(cast.points);
                    let mnx = floor(min(...o2.x), res);
                    let mxx = floor(max(...o2.x), res);
                    //console.log(mnx, mxx, ...o2.x);
                    for (var x = mnx; x <= mxx; x += res) {
                        func(x, y);
                    }
                }
            }
        },
        vertices: {
            get: function (verts) {
                let vs = [];
                for (var i = 0; i < verts.length; i += 2) {
                    vs.push(createVector(verts[i], verts[i + 1]));
                }
                return vs;
            },
            get2: function (vs) {
                let verts = [];
                for (var v of vs) {
                    verts.push(v.x, v.y);
                }
                return verts;
            },
            rotate: function (ox, oy, ang, verts) {
                //console.log(ang);
                let vs = this.get(verts);
                let o = createVector(ox, oy);
                for (var v of vs) {
                    v.sub(o).rotate(ang).add(o);
                }
                return Shapes.shape.vertices.get2(vs);
            },
            setOrigin: function (ox, oy, verts) {
                let vs = this.get(verts);
                let o = createVector(ox, oy);
                for (var v of vs) {
                    v.sub(o);
                }
                return vs;
            },
            points: function (verts, res = 1) {
                let per = Shapes.shape.perimeter.get(verts);
                //console.log(per);
                res = parseInt(res);
                let vs = [];
                for (var i = 0; i < per; i += res) {
                    //console.log(i);
                    vs.push(Shapes.shape.perimeter.point(i, verts));
                }
                return vs;
            }
        },
        perimeter: {
            get: function (verts) {
                let ans = 0;
                let vs = Shapes.shape.vertices.get(verts);
                for (var i = 0; i < vs.length; i++) {
                    let ai = i;
                    let bi = (i + 1) % vs.length;
                    let dist = Vector.dist(vs[ai], vs[bi]);
                    ans += dist;
                }
                return ans;
            },
            point: function (t, verts) {
                let vs = Shapes.shape.vertices.get(verts);
                let a;
                let b;
                let pt;
                let per = this.get(verts)
                t = t % per;
                let v = [];
                for (var i = 0; i < vs.length; i++) {
                    let ai = i;
                    let bi = (i + 1) % vs.length;
                    let a = vs[ai];
                    let b = vs[bi];
                    let dist = Vector.dist(vs[ai], vs[bi]);
                    if (dist < t) {
                        t -= dist;
                    } else {
                        pt = Vector.interpolate(a, b, t / Vector.dist(a, b));
                        break;
                    }
                }
                return pt;
            },
            interpolate: function (t, verts) {
                return this.point(t * this.get(verts), verts);
            }
        }
    }
}
// #endregion

// #region color
function RGBToHSL(r, g, b, a = 255) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    if (delta == 0)
        h = 0;
    // Red is max
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return [h / 360 * 255, s / 100 * 255, l / 100 * 255, a];
}
function HSLToRGB(h, s, l, a = 255) {
    h = h / 255 * 359;
    // Must be fractions of 1
    s /= 255;
    l /= 255;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b, a];
}
var fl = true;
var st = true;
function brightness(rgb) {
    if (typeof rgb == "object") {
        rgb = rgb.slice(0, 3)
        let mn = min(...rgb);
        let mx = max(...rgb);
        //console.log(mn);
        return avg(mn, mx);
    }
}
function addAlpha(col, al, mode) {
    if ("RGB" == mode) {
        return col.replace("b(", "ba(").replace(")", ", " + al / 255 + ")")
    }
}
function alpha(al) {
    ctx.globalAlpha = al / 255;
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
function rgb(...args) {
    if (args.length == 1) {
        args[0] = constraint(args[0], 0, 255);
        return "rgba(" + args[0] + ", " + args[0] + ", " + args[0] + ", 1)";
    } else if (args.length == 2) {
        args[0] = constraint(args[0], 0, 255);
        args[1] = constraint(args[1], 0, 255);
        return "rgba(" + args[0] + ", " + args[0] + ", " + args[0] + ", " + args[1] / 255 + ")";
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
        return "rgba(" + args[0] + ", " + args[1] + ", " + args[2] + ", " + args[3] / 255 + ")";
    }
}
function color() {
    args = filterArray(arguments);
    if (typeof args[0] == "string") {
        return args[0];
    }
    if (Canvas.colorMode == RGB) {
        if (args[0] instanceof Array) {
            return color(...args[0]);
        }
        if (args.length == 1) {
            args[0] = constraint(args[0], 0, 255);
            return [args[0], args[0], args[0], 255];
        } else if (args.length == 2) {
            args[0] = constraint(args[0], 0, 255);
            args[1] = constraint(args[1], 0, 255);
            return [args[0], args[0], args[0], args[1]];
        } else if (args.length == 3) {
            args[0] = constraint(args[0], 0, 255);
            args[1] = constraint(args[1], 0, 255);
            args[2] = constraint(args[2], 0, 255);
            return [args[0], args[1], args[2], 255];
        } else if (args.length == 4) {
            args[0] = constraint(args[0], 0, 255);
            args[1] = constraint(args[1], 0, 255);
            args[2] = constraint(args[2], 0, 255);
            args[3] = constraint(args[3], 0, 255);
            return [args[0], args[1], args[2], args[3]];
        }
    } else if (Canvas.colorMode == HSL) {
        if (args.length == 1) {
            return "hsla(" + args[0] / 255 * 360 + ", 100%, 50%, 1)";
        } else if (args.length == 2) {
            return "hsla(" + args[0] / 255 * 360 + ", 100%, 50%, " + args[1] / 255+ ")";
        }else if (args.length == 3) {
            return "hsla(" + args[0] / 255 * 360 + ", " + args[1] / 2.55 + "%, " + args[2] / 2.55 + "%, 1)";
        } else if (args.length == 4) {
            return "hsla(" + args[0] / 255 * 360 + ", " + args[1] / 2.55 + "%, " + args[2] / 2.55 + "%," + args[3] / 255 + ")";
        }
    }
}
function HSVtoHSL(h, sv, v, a = 255) {
    sv = sh / 255;
    v = v / 255;
    let l = v * (1 - sv / 2);
    let sl = 0;
    if (!(l == 0) && !(l == 1)) {
        sl = (v - l) / (min(l, 1 - l));
    }
    return [h, sl * 255, l * 255, a];
}
function splitRGB(rgba) {
    //let col = rgb.split(", ");
    //let r = parseFloat(col[0].split("rgba(")[1]);
    //let g = parseFloat(col[1]);
    //let b = parseFloat(col[2]);
    //let a = parseFloat(col[3].slice(0, col[3].length - 1)) * 255;
    let r = rgba[0];
    let g = rgba[1];
    let b = rgba[2];
    let a = rgba[3];
    return {
        r: r,
        g: g,
        b: b,
        a: a,
        mult: function (t) {
            return color(r * t, g * t, b * t, a);
        },
        string: function () {
            return rgb(r, g, b, a);
        }
    };
}
const Colors = {
    add: function (...args) {
        let cols = [];
        for (var i = 0; i < args.length; i++) {
            cols.push(splitRGB(args[i]));
        }
        cols = splitArray(cols);

        let sum = {
            r: ArrayMath.number(cols.r),
            g: ArrayMath.number(cols.g),
            b: ArrayMath.number(cols.b),
            a: ArrayMath.number(cols.a)
        };
        return color(sum.r, sum.g, sum.b, sum.a);
    },
    weighted: function (...args) {
        let cols = [];
        for (var i = 0; i < args.length; i += 2) {
            cols.push(splitRGB(args[i]).mult(args[i + 1]));
        }
        let col = this.add(...cols);
        return col;
    },
    interpolate: function (a, b, t) {
        return Colors.weighted(a, 1 - t, b, t);
     },
    avg: function (...cols) {
        let col = this.add(...cols);
        col = Color.mult(col, 1 / cols.length);
        return col;
    }
};
const Color = {
    mult: function (col, t) {
        let c = splitRGB(col);
        return c.mult(t);
    },
    setAlpha: function (col, alpha) {
        let c = splitRGB(col);
        c.a = alpha;
        return c.string();
    },
    RandomColorBetween: function (...args) {
        let arr = [];
        for (var i = 0; i < args.length; i += 2) {
            if (i + 1 >= args.length) {
                arr.push(args[i]);
            } else {
                arr.push(Random.range(args[i], args[i + 1]));
            }
        }
        return color(...arr);
    },
    RandomColor: function (...args) {
        let arr = [];
        for (var i = 0; i < args.length; i++) {
            arr.push(Random.range(0, args[i]));
        }
        return color(...arr);
    }
}
function stroke() {
    var col = color(...arguments);
    if (col instanceof Array) {
        if (Canvas.colorMode == RGB) {
            //console.log(rgb);
            col = rgb(...col);
        }// else if (Canvas.colorMode == hsl) {
        //    col = hsl(...col);
        //}

    }
    ctx.strokeStyle = col;
    Canvas.strokeStyle = col;
}
function nofill() {
    fl = false;
    st = true;
}
function fill() {
    var col = color(arguments[0], arguments[1], arguments[2], arguments[3]);
    if (col instanceof Array) {
        if (Canvas.colorMode == RGB) {
            col = rgb(...col);
        }// else if (Canvas.colorMode == hsl) {
        //    col = hsl(...col);
        //}

    }
    fl = true;
    ctx.fillStyle = col;
    Canvas.fillStyle = col;
}
function noStroke() {
    st = false;
    fl = true;
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
function includes(arr, item) {
    let farr = arr.filter(function (it) {
        if (it == item) {
            return item;
        }
    });
    return (farr.length > 0);
}
function includesVector(arr, item) {
    let farr = arr.filter(function (it) {
        if (it.x == item.x && it.y == item.y) {
            return item;
        }
    });
    return (farr.length > 0);
}
function fillArray(len, ...fls) {
    let arr = new Array(len);
    for (var i = 0; i < len; i++) {
        let th = i % fls.length;
        arr[i] = fls[th];
    }
    return arr;
}
function Array2D(width, height) {
    this.array = new Array(width * height);
    this.width = width;
    this.height = height;
    this.getCol = function (col) {
        let cl = [];
        for (var i = 0; i < this.height; i++) {
            cl.push(this.array[this.index(col, i)]);
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
const ArrayMath = {
    number: function (arr1) {
        let sum = 0;
        for (var i = 0; i < arr1.length; i++) {
            sum += arr1[i];
        }
        return sum;
    },
    mult: function (arr1, arr2) {
        arr1 = [...arr1];
        for (var i = 0; i < arr1.length; i++) {
            arr1[i] *= arr2[i];
        }
        return arr1;
    },
    add: function (arr1, arr2) {
        arr1 = [...arr1];
        for (var i = 0; i < arr1.length; i++) {
            arr1[i] += arr2[i];
        }
        return arr1;
    },
    sub: function (arr1, arr2) {
        arr1 = [...arr1];
        for (var i = 0; i < arr1.length; i++) {
            arr1[i] -= arr2[i];
        }
        return arr1;
    },
    scalar: {
        mult: function (arr, scal) {
            arr = [...arr];
            for (var i = 0; i < arr.length; i++) {
                arr[i] *= scal;
            }
            return arr;
        }
    }
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

// #region Equations

/*
 * y = mx + c
 * c = y - mx
 * x = (y - c) / m
*/
/*
 * x^2 + y^2 = r ^ 2
 */
const Equation = {
    line: function (x1, y1, x2, y2) {
        if (x2 < x1) {
            //console.log(x2, y2);
            let temp = [x1, y1];
            [x1, y1] = [x2, y2];
            [x2, y2] = temp;
        }
        let m = (x2 - x1) / (y2 - y1);
        let c = y1 - m * x1;
        return new LineEquation(m, c);
    },
    circle: function (x, y, r) {
        return new CircleEquation(x, y, r);
    }
}
class CircleEquation {
    constructor(x, y, r) {
        this.cx = x;
        this.cy = y;
        this.r = r;
    }
    x(y) {
        y -= this.cy;
        let x = (this.r ** 2 - y ** 2) ** 0.5;
        return [x + this.cx, -x + this.cx];
    }
    y(x) {
        x -= this.cx;
        let y = (this.r ** 2 - x ** 2) ** 0.5;
        return [y + this.cy, -y + this.cy];
    }
}
class LineEquation {
    constructor(m, c) {
        this.m = m;
        this.c = c;
    }
    x(y) {
        return (y - this.c) / this.m;
    }
    y(x) {
        return this.c + this.m * x;
    }
    intersects(eq2) {
        let a1 = eq2.m;
        let b1 = -1;
        let c1 = eq2.c;
        let a2 = this.m;
        let b2 = -1;
        let c2 = this.c;
        if (a1 == a2) {
            return;
        }
        let den = (a1 * b2 - a2 * b1);
        let x = (b1 * c2 - b2 * c1) / den;
        let y = (c1 * a2 - c2 * a1) / den;
        return createVector(x, y);
    }
}
// #endregion

// #region Canvas

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
let shape = {
    vertices: [],
    done: true,
    begin: function () {
        this.done = false;
        this.vertices = [];
    },
    addVertex: function (x, y) {
        x = Canvas.x(x);
        y = Canvas.y(y);
        this.vertices.push(createVector(x, y));
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
            arguments[i] = Canvas.x(arguments[i]);
            arguments[i + 1] = Canvas.y(arguments[i + 1]);
        }
        ctx.beginPath();
        ctx.lineTo(arguments[0], arguments[1]);
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
const OPEN = 0;
const CLOSE = 1;
{
    let vertices = [];
    function vertex(x, y) {
        vertices.push(new Vector(Canvas.x(x), Canvas.y(y)));
    }
    function beginShape() {
        vertices = [];
    }
    function endShape(close = CLOSE) {
        ctx.beginPath();
        ctx.lineTo(vertices[0].x, vertices[0].y);
        for (var i = 1; i < vertices.length; i++) {
            ctx.lineTo(arguments[i].x, vertices[i].y);
        }
        if (close == CLOSE) {
            ctx.lineTo(vertices[0].x, vertices[0].y);
        }
        ctx.closePath();
        if (fl && close == CLOSE) {
            ctx.fill();
        }
        if (st) {
            ctx.stroke();
        }
    }
}
function setPixel(x, y, col) {
    x = Canvas.x(x);
    y = Canvas.y(y);
    let c = ctx.fillStyle;
    ctx.fillStyle = col;
    ctx.fillRect(x, y, 1, 1);
    ctx.fillStyle = c;
}
function triangle(x, y, x1, y1, x2, y2) {
    x = Canvas.x(x);
    y = Canvas.y(y);
    x1 = Canvas.x(x1);
    y1 = Canvas.y(y1);
    x2 = Canvas.x(x2);
    y2 = Canvas.y(y2);

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
    x = Canvas.x(x);
    y = Canvas.y(y);
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
    x = Canvas.x(x);
    y = Canvas.y(y);
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
    x = Canvas.x(x);
    y = Canvas.y(y);
    circle(x, y, ctx.lineWidth / 2);
}
function rect(x, y, w, h) {
    x = Canvas.x(x);
    y = Canvas.y(y);
    w = Canvas.w(w);
    h = Canvas.h(h);
    if (st) {
        ctx.beginPath();
        ctx.strokeRect(x, y, w, h);
        ctx.closePath();
    }
    if (fl) {
        ctx.fillRect(x, y, w, h);
    }
}
const Canvas = {
    lineWidth: undefined,
    lineCap: "butt",
    strokeStyle: undefined,
    fillStyle: undefined,
    colorMode: RGB,
    xo: 0,
    yo: 0,
    ym: 1,
    xm: 1,
    xo1: 0,
    yo1: 0,
    x: function (x) {
        //console.log(x - this.xo1);
        return this.xo + x * this.xm;
    },
    y: function (y) {
        return this.yo + y * this.ym;
    },
    xi: function (x) {
        return (x - this.xo) * this.xm;
    },
    yi: function (y) {
        return (y - this.yo) * this.ym;
    },
    w: function (w) {
        return w * this.xm;
    },
    h: function (h) {
        return h * this.ym;
    },
    flipY: function () {
        this.ym *= -1;
        this.yo = CanvasHeight - this.yo;
    },
    flipX: function () {
        this.xm *= -1;
        this.xo = CanvasWidth - this.xo;
    },
    Vector2: function (vec) {
        return new Vector2(this.x(vec.x), this.y(vec.y));
    },
    setOrigin: function (x = CanvasWidth / 2, y = CanvasHeight / 2) {
        this.xo = x;
        this.yo = y;
    },
    enabled: false,
    AngleMode: AngleModes.degrees
}
var ctx, CanvasWidth, CanvasHeight, CanvasColor, mouseOverCanvas, CanvasOffset, mousePressed = false;
function lineJoin(ty) {
    ctx.lineJoin = ty;
}
function lineCap(cap) {
    Canvas.lineCap = cap;
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
    x = Canvas.x(x);
    y = Canvas.y(y);
    if (!fl) {
        ctx.strokeText(txt, x, y);
    } else {
        ctx.fillText(txt, x, y);
    }
}
var scaled = new Vector2(1, 1);
function scale(x, y = x) {
    ctx.scale(x, y);
    scaled.x *= x;
    scaled.y *= y;
}
function lineWidth(w) {
    ctx.lineWidth = w;
    Canvas.lineWidth = w;
}
function createCanvas(w = windowWidth, h = windowHeight, col = "rgb(255, 255, 255)") {
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    CanvasWidth = w;
    CanvasHeight = h;
    Canvas.enabled = true;
    canvas.style.backgroundColor = col;
    document.body.insertBefore(canvas, document.body.childNodes[0]);
    ctx = canvas.getContext("2d");
    Canvas.lineWidth = ctx.lineWidth;
    Canvas.fillStyle = ctx.fillStyle;
    Canvas.strokeStyle = ctx.strokeStyle;
    canvas.style.border = "1px solid black";
    canvas.addEventListener("mouseover", function () { mouseOverCanvas = true; });
    canvas.addEventListener("mouseout", function () { mouseOverCanvas = false; });
    ctx.textAlign = "start";
    ctx.textBaseline = "top";
    Canvas.canvas = canvas;
    calculateCanvasOffset();
    return canvas;
}
function calculateCanvasOffset() {
    let el = Canvas.canvas;
    var _x = el.offsetLeft - el.scrollLeft;
    var _y = el.offsetTop - el.scrollTop;
    CanvasOffset = new Vector2(_x, _y);
}
function clear() {
    let t = ctx.getTransform();
    ctx.resetTransform();
    ctx.clearRect(-CanvasWidth * 5, -CanvasHeight * 5, CanvasWidth * 10, CanvasHeight * 10);
    ctx.setTransform(t);
}
function backGround() {
    var col = color(arguments[0], arguments[1], arguments[2], arguments[3]);
    var cl = ctx.fillStyle;
    ctx.fillStyle = col;
    ctx.fillRect(-CanvasWidth * 5, -CanvasHeight * 5, CanvasWidth * 10, CanvasHeight * 10);
    ctx.fillStyle = cl;
}
function line(x, y, x1, y1) {
    x = Canvas.x(x);
    y = Canvas.y(y);
    x1 = Canvas.x(x1);
    y1 = Canvas.y(y1);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.stroke();

    if (ctx.lineCap == 'round') {
        //console.log(ctx.lineWidth);
        circle(x, y, Canvas.lineWidth / 2);
        circle(x1, y1, Canvas.lineWidth / 8);
    }
}
function rotate(deg) {
    ctx.rotate(radians(deg));
}
function translate(x, y) {
    x = Canvas.x(x);
    y = Canvas.y(y);
    ctx.translate(x, y);
}
{
    let savedTransforms = [];
    function push() {
        let t = ctx.getTransform();
        savedTransforms.push(t);
        return t;
    }

    function pop() {
        let t = savedTransforms.pop();
        ctx.setTransform(t);
        return t;
    }
} // push and pop
let densityVal = 1;
function pixelDensity(val) {
    if (typeof val == "number") {
        val = 1 / val * window.devicePixelRatio;
        var c = ctx.canvas;
        var w = c.width, h = c.height;
        c.setAttribute('width', w * val);
        c.setAttribute('height', h * val);
        //console.log(w);
        c.style.width = w + "px";
        c.style.height = h + "px";
        ctx.scale(val, val);
        backGround(255);
    } else {
        return densityVal;
    }
}
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
// #endregion

// #region HTML
{
    function createVector2SLider(mnx, mxx, mny, mxy, step = 1, valx = (mnx + mxx) / 2, valy = (mny + mxy) / 2, n = "") {
        return new Vector2Slider(mnx, mxx, mny, mxy, step, valx, valy, n);
    }
    function createVector3SLider(mnx, mxx, mny, mxy, mnz, mxz, step = 1, valx = (mnx + mxx) / 2, valy = (mny + mxy) / 2, valz = (mnz + mxz) / 2, n = "") {
        return new Vector3Slider(mnx, mxx, mny, mxy, mnz, mxz, step, valx, valy, valz, n);
    }
    class Vector2Slider {
        constructor(mnx, mxx, mny, mxy, step = 1, valx = (mnx + mxx) / 2, valy = (mny + mxy) / 2, n = "") {
            if (n != "") {
                n += " "
            }
            this.mnx = mnx;
            this.mny = mny;
            this.mnz = mnz;
            this.mxx = mxx;
            this.xs = createSlider(mnx, mxx, step, valx, n + "x");
            this.ys = createSlider(mny, mxy, step, valy, n + "y");
        }
        get x() {
            return this.xs.value;
        }
        get xt() {
            return map(this.xs.value, this.mnx, this.mxx, 0, 1);
        }
        get yt() {
            return map(this.ys.value, this.mny, this.mxy, 0, 1);
        }
        get x() {
            return this.xs.value;
        }
        get y() {
            return this.ys.value;
        }
        get v() {
            return new Vector2(this.x, this.y);
        }
        get vt() {
            return new Vector2(this.xt, this.yt);
        }
    }
    class Vector3Slider {
        constructor(mnx, mxx, mny, mxy, mnz, mxz, step = 1, valx = (mnx + mxx) / 2, valy = (mny + mxy) / 2, valz = (mnz + mxz) / 2, n = "") {
            if (n != "") {
                n += " "
            }
            this.xs = createSlider(mnx, mxx, step, valx, n + "x");
            this.ys = createSlider(mny, mxy, step, valy, n + "y");
            this.zs = createSlider(mnz, mxz, step, valz, n + "z");
            this.mnx = mnx;
            this.mny = mny;
            this.mnz = mnz;
            this.mxx = mxx;
            this.mxy = mxy;
            this.mxz = mxz;
        }
        get xt() {
            return map(this.xs.value, this.mnx, this.mxx, 0, 1);
        }
        get yt() {
            return map(this.ys.value, this.mny, this.mxy, 0, 1);
        }
        get zt() {
            return map(this.zs.value, this.mnz, this.mxz, 0, 1);
        }
        get x() {
            return this.xs.value;
        }
        get y() {
            return this.ys.value;
        }
        get z() {
            return this.zs.value;
        }
        get v() {
            return new Vector3(this.x, this.y, this.z);
        }
        get vt() {
            return new Vector3(this.xt, this.yt, this.zt);
        }
    }
    function HTMLButton(x, y, width, height, col) {
        this.element = document.createElement("button");
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
        document.body.appendChild(this.element);
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
    function HTMLElement(elem, id, par = document.body) {
        var e = document.createElement(elem);
        e.setAttribute("id", id);
        par.appendChild(e);
        return e;
    }
    function addHTMLBreak(par = document.body) {
        let alem = document.createElement("br");
        document.body.appendChild(alem);
    }
    function HTMLtextBox(text, par = document.body, addbreak = true) {
        if (addbreak) {
            addHTMLBreak();
        }
        let elem = document.createElement("div");
        elem.classList.add("text");
        elem.innerHTML = text;
        par.appendChild(elem);
    }
    function createDiv(par = document.body) {
        let div = document.createElement("div");
        par.appendChild(div);
        return div;
    }
    function createSlider(min, max, step = 1, val = (min + max) / 2, name, par = document.body) {
        addHTMLBreak();
        let div = createDiv(par);
        div.classList.add("sliderCont");
        if (name) {
            HTMLtextBox(name, div, false);
        }
        let slider = document.createElement("input");
        slider.type = "range";
        slider.min = min;
        //console.log(val);
        slider.max = max;
        slider.step = step;
        slider.value = val;
        let input = document.createElement("input");
        input.type = "float";
        input.value = parseFloat(val);
        input.oninput = function () {
            //console.log(this.value);
            this.value = this.value.replace(/[^0-9.]/g, '');
        }
        input.onchange = function () {
            slider.value = this.value;
            this.value = slider.value;
        }
        input.classList.add("sliderText");
        slider.oninput = function () {
            input.value = this.value;
        }
        div.appendChild(slider);
        div.appendChild(input);
        console.log(slider.value);
        let cls = new Slider(slider, input, div);
        console.log(slider.value);
        return cls;
    }
    class Slider {
        slider;
        input;
        div;
        constructor(slider, input, div) {
            this.slider = slider;
            this.input = input;
            this.div = div;
            this.events = [];
        }
        get value() {
            //console.log(this.slider.value);
            return parseFloat(this.slider.value);
        }
        set value(value) {
            this.slider.value = value;
        }
        unbind(key, func) {
            if (this.events.includes(key)) {
                this.slider.removeEventListener(key, func);
                this.input.removeEventListener(key, func);
            }
        }
        bind(key, func) {
            this.slider.addEventListener(key, func);
            this.input.addEventListener(key, func);
        }
    }
}
// #endregion

// #region Image
class camera {
    static video;
    static set res(re) {
        camera.video.style.width = re + "px";
        camera.video.style.height = re + "px";
    }
    static Init() {
        const video = document.createElement("video");
        video.setAttribute("playsinline", "");
        video.setAttribute("autoplay", "");
        video.setAttribute("muted", "");
        video.style.width = 200 + "px";
        video.style.height = 200 + "px";

        const facingMode = "user";
        const constraints = {
            audio: false,
            video: {
                facingMode
            }
        };

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            video.srcObject = stream;
        });
        document.body.appendChild(video);
        camera.video = video;
        camera.image = new Image2(camera.video);
    }
    static image;
}
var pixels = [];
class Image2 {
    static canvas;
    static ctx;
    constructor(im) {
        this.width = im.width;
        this.height = im.height;
        this.image = im;
    }
    loadPixels() {
        this.pixels = [];
        canvas2.width = this.width;
        canvas2.height = this.height;
        ctx2.drawImage(this.image, 0, 0);
        this.data = ctx2.getImageData(0, 0, this.width, this.height);
        for (var i = 0; i < this.data.data.length; i += 4) {
            let col = this.data.data.slice(i, i + 4);
            if (Canvas.colorMode == HSL) {
                col = RGBToHSL(...col);
            }
            this.pixels.push(col);
        }
    }
    filter(f) {
        this.loadPixels();
        for (var i = 0; i < this.pixels.length; i++) {
            let p = this.pos(i);
            this.pixels[i] = f(p.x, p.y, i);
        }
        this.updatePixels();
    }
    pos(ind) {
        let x = ind % this.width;
        let y = (ind - x) / this.width;
        return new Vector2(x, y);
    }
    index(x, y) {
        return y * this.width + x;
    }
    grayScale() {
        this.loadPixels();
        for (var i = 0; i < this.pixels.length; i++) {
            //let dark = avg(...this.pixels[i].slice(0, 3));
            let dark = brightness(this.pixels[i]);
            this.pixels[i] = [dark, dark, dark, 255];
        }
        this.updatePixels();
    }
    updatePixels() {
        let pixs = [];
        for (var i = 0; i < this.pixels.length; i++) {
            let col = this.pixels[i];
            if (Canvas.colorMode == HSL) {
                col = HSLToRGB(...col);
            }
            pixs.push(...col);
        }
        setArray(this.data.data, pixs);
        canvas2.width = this.width;
        canvas2.height = this.height;
        ctx2.putImageData(this.data, 0, 0);
        this.image.src = ctx2.canvas.toDataURL();
        //console.log(this.image);
    }
    onload(func) {
        var ths = this;
        this.image.onload = function () {
            //console.log(ths.image);
            ths.image.onload = function () { };
            func(ths);
        };
    }
}
{
    var canvas2 = document.createElement("canvas");
    var ctx2 = canvas2.getContext("2d");
    function loadPixels() {
        let data = ctx.getImageData(0, 0, CanvasWidth, CanvasHeight);
        pixels = [];
        for (var i = 0; i < data.data.length; i += 4) {
            let arr = data.data.slice(i, i + 4);
            if (Canvas.colorMode == HSL) {
                arr = RGBToHSL(...arr);
            }
            //console.log(arr);
            pixels.push(arr);
        }
        Canvas.data = data;
    }
    function updatePixels() {
        setArray(Canvas.data, joinArrays(pixels));
        let pixs = [];
        for (var i = 0; i < pixels.length; i++) {
            let arr = pixels[i];
            if (Canvas.colorMode == HSL) {
                arr = HSLToRGB(...arr);
            }
            pixs.push(...arr);
        }
        setArray(Canvas.data.data, pixs);
        ctx.putImageData(Canvas.data, 0, 0);
    }
    function image(image, ...args) {
        //args[0].crossOrigin = "";
        ctx.drawImage(image.image, ...args);
    }
    let pushedImages = [];
    function pushImage() {
        pushedImages.push(getImage());
    }
    function getImage() {
        let img = new Image();
        img.src = ctx.canvas.toDataURL();
        return img;
    }
    function createImage(w, h, cb) {
        canvas2.width = w;
        canvas2.height = h;
        let img = new Image(w, h);
        ctx2.fillStyle = color(0, 0, 0, 0);
        ctx2.fillRect(0, 0, w, h);
        img.src = ctx2.canvas.toDataURL();
        let im = new Image2(img);
        img.onload = function () {
            img.onload = () => { };
            if (cb) {
                cb(im);
            }
            loadingResources--;
            checkForStart();
        };
        return im;
    }
    function popImage() {
        ctx.drawImage(pushedImages.pop());
    }
    function loadImage(name, width, height, cb) {
        loadingResources++;
        var myImage = new Image();
        myImage.src = name;
        let im = new Image2(myImage);
        myImage.onload = function () {
            myImage.onload = () => { };
            im.width = myImage.width;
            im.height = myImage.height;
            //console.log(myImage.width);
            if (cb) {
                cb(im);
            } else if (!height && width) {
                width(im);
            }
            loadingResources--;
            checkForStart();
        };
        if (width && height) {
            myImage.width = width;
            myImage.height = height;
        }
        return im;
    }
    Image2.canvas = canvas2;
    Image2.ctx = ctx2;
}
function joinArrays(arrs) {
    let arr = [];
    for (var i = 0; i < arrs.length; i++) {
        arr.push(...arrs[i]);
    }
    ///console.log(arrs);
    return arr;
}
function setArray(arr1, arr2) {
    for (var i = 0; i < arr1.length; i++) {
        arr1[i] = arr2[i];
    }
    //console.log(arr2);
}
// #endregion

//#region Gizmos

let gizmos = [];
let gizmoSelected = false;
class Button {
    id;

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

    static gizmos = [];
    static update() {
        for (var i = Button.gizmos.length - 1; i >= 0; i--) {
            let gizmo = Button.gizmos[i];
            if (gizmo.selfUpdate) {
                gizmo.update();
            }
        }
    }
    static draw() {
        for (var i = 0; i < Button.gizmos.length; i++) {
            let gizmo = Button.gizmos[i];
            if (gizmo.selfDraw) {
                gizmo.draw();
            }
        }
    }
    constructor(x, y, col = color(0, 255, 0)) {
        this.size = [];
        this.event = new Event1();
        this.offset = createVector();
        this.size[0] = 10;
        this.shape = GizmoShapes.circle;
        this.position = createVector(x, y);
        this.selfUpdate = true;
        this.selfDraw = true;
        this.id = Gizmo2.gizmos.length;
        Button.gizmos.push(this);
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
            return (Vector.dist(Vector.add(this.position, this.offset), mouse) <= this.size[0]);
        } else if (this.shape == GizmoShapes.square) {
            let vec = Vector.add(this.position, this.offset);
            return Between.square(vec, this.size[0], mouse);
        } else if (this.shape == GizmoShapes.rect) {
            let vec = Vector.add(this.position, this.offset);
            return Between.rect(vec, this.size[0], this.size[1], mouse);
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
        Button.gizmos.splice(this.id, 1);
        for (var i = this.id; i < Button.gizmos.length; i++) {
            Button.gizmos[i].id--;
        }
        return this;
    }
    update() {
        this.hovered = this.getHoveredInfo();
        if (mousePressed) {
            if (!this.stateChanged && this.hovered) {
                this.selected = true;
                if (this.onClick) {
                    this.onClick();
                }
                this.event.Fire();
                this.stateChanged = true;
            } else {
                this.selected = false;
            }
        } else {
            this.stateChanged = false;
        }
    }
    bind(func) {
        this.event.bind(func);
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
            //console.log("ok");
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
class Gizmo {
    static gizmos = [];
    static update() {
        for (var i = Gizmo.gizmos.length - 1; i >= 0; i--) {
            let gizmo = Gizmo.gizmos[i];
            if (gizmo.selfUpdate) {
                gizmo.update();
            }
        }
    }
    static draw() {
        for (var i = 0; i < Gizmo.gizmos.length; i++) {
            let gizmo = Gizmo.gizmos[i];
            if (gizmo.selfDraw) {
                gizmo.draw();
            }
        }
    }
    id;
    shape;
    parent;
    hovered;
    selected;
    snapX = 0;
    snapY = 0;
    size = [];
    mouseOffset;
    lastPosition;
    children = [];
    snapped = false;
    rotatingChildren = [];

    setParent(par, rotate = false) {
        par.children.push(this);
        this.parent = par;
        par.rotatingChildren.push(rotate);
    }
    setChild(child, rotate = false) {
        this.children.push(child);
        child.parent = this;
        this.rotatingChildren.push(rotate);
    }
    constructor(x, y, col = color(0, 255, 0)) {
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
        this.id = Gizmo.gizmos.length;
        this.setColor(col);
        Gizmo.gizmos.push(this);
    }
    getPosition() {
        return Vector.add(this.position, this.getParentPosition());
    }
    getParentPosition() {
        if (this.parent) {
            return this.parent.getPosition();

        } else {
            return createVector(0, 0);
        }
    }
    //updatePosition(offset, ...notUP) {
    //    this.position.add(offset);
    //    let off = Vector.sub(this.position, this.lastPosition);
    //    for (var i = 0; i < this.children.length; i++) {
    //        let child = this.children[i];
    //        //console.log(!includes());
    //        if (child != this.parent && !includes(notUP, child)) {
    //            child.updatePosition(offset, ...notUP, this);
    //        }
    //    }
    //    this.lastPosition = this.position;
    //}
    setConstraints(a = craeteVector(), b = createVector(CanvasWidth, CanvasHeight)) {
        this.constraintedA = a;
        this.constraintedB = b;
        return this;
    }
    constraintToCircle(c, r) {
        this.position = Vector.limitDistance(c, this.position, r);
        return this;
    }
    setName(nm) {
        this.name = nm;
        return this;
    }
    setColor(col) {
        this.col = splitRGB(col);
        this.normalColor = this.col.string();
        this.hoveredColor = this.col.mult(0.90);
        this.clickedColor = this.col.mult(0.80);
        //console.log(this.normalColor, this.hoveredColor, this.clickedColor);
        return this;
    }
    destroy() {
        Gizmo.gizmos.splice(this.id, 1);
        for (var i = this.id; i < Gizmo.gizmos.length; i++) {
            Gizmo.gizmos[i].id--;
        }
        return this;
    }
    setPos(pos) {
        this.position = pos;
        //if (this.lastPosition != pos) {
        //    let off = Vector.sub(pos, this.lastPosition);
        //    for (var i = 0; i < this.children.length; i++) {
        //        this.children[i].updatePosition(off, this);
        //    }
        //    this.lastPosition = this.position;
        //}
        return this;
    }
    getMouse() {
        //console.log(mouse);
        let par = this.getParentPosition();
        return Vector.sub(mouse, par);
    }
    update() {
        this.hovered = this.getHoveredInfo();
        if (this.hovered || this.selected) {
            if (!gizmoSelected || this.selected) {
                if (mousePressed) {
                    let mouse = this.getMouse();
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
        if (this.snapped) {
            this.position.x = floor(this.position.x, this.snapX);
            this.position.y = floor(this.position.y, this.snapY);
        }
        this.lastPosition = this.position;
        return this;
    }
    setSnap(x, y = x) {
        this.snapped = true;
        this.snapX = x;
        this.snapY = y;
        return this;
    }
    constraintToLineSeg(a, b) {
        let point = distance.line(a.x, a.y, b.x, b.y, this.position.x, this.position.y);
        ln(point, this.position);
        this.position = point.point;
        return this;
    }
    get x() {
        return this.getPosition().x;
    }
    get y() {
        return this.getPosition().y;
    }
    get px() {
        return this.position.x;
    }
    get py() {
        return this.position.y;
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
        loadColor();
        return this;
    }
    drawShape() {
        let pos = this.getPosition();
        if (this.shape == GizmoShapes.circle) {
            circle(pos.x + this.offset.x, pos.y + this.offset.y, this.size[0]);
        } else if (this.shape == GizmoShapes.square) {
            rect(pos.x + this.offset.x, pos.y + this.offset.y, this.size[0], this.size[0]);
        } else if (this.shape == GizmoShapes.rect) {
            rect(pos.x + this.offset.x, pos.y + this.offset.y, this.size[0], this.size[1]);
        }
        return this;
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
        return this;
    }
    getHoveredInfo() {
        let mouse1 = this.getMouse();
        //console.log(mouse, mouse1);
        if (this.shape == GizmoShapes.circle) {
            return (Vector.dist(Vector.add(this.position, this.offset), mouse1) <= this.size[0]);
        } else if (this.shape == GizmoShapes.square) {
            let vec = Vector.add(this.position, this.offset);
            return Between.square(vec, this.size[0], mouse1);
        } else if (this.shape == GizmoShapes.rect) {
            let vec = Vector.add(this.position, this.offset);
            return Between.rect(vec, this.size[0], this.size[1], mouse1);
        }
        return false;
    }
}
class Gizmo2 {
    id;

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

    static gizmos = [];
    static update() {
        for (var i = Gizmo2.gizmos.length - 1; i >= 0; i--) {
            let gizmo = Gizmo2.gizmos[i];
            if (gizmo.selfUpdate) {
                gizmo.update();
            }
        }
    }
    static draw() {
        for (var i = 0; i < Gizmo2.gizmos.length; i++) {
            let gizmo = Gizmo2.gizmos[i];
            if (gizmo.selfDraw) {
                gizmo.draw();
            }
        }
    }
    constructor(x, y, col = color(0, 255, 0)) {
        this.size = [];
        this.offset = createVector();
        this.size[0] = 10;
        this.shape = GizmoShapes.circle;
        this.position = createVector(x, y);
        this.selfUpdate = true;
        this.selfDraw = true;
        this.id = Gizmo2.gizmos.length;
        Gizmo2.gizmos.push(this);
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
            return (Vector.dist(Vector.add(this.position, this.offset), mouse) <= this.size[0]);
        } else if (this.shape == GizmoShapes.square) {
            let vec = Vector.add(this.position, this.offset);
            return Between.square(vec, this.size[0], mouse);
        } else if (this.shape == GizmoShapes.rect) {
            let vec = Vector.add(this.position, this.offset);
            return Between.rect(vec, this.size[0], this.size[1], mouse);
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
        Gizmo2.gizmos.splice(this.id, 1);
        for (var i = this.id; i < Gizmo2.gizmos.length; i++) {
            Gizmo2.gizmos[i].id--;
        }
        return this;
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
            //console.log("ok");
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
// #endregion

// #region Matrices
class Matrix extends Array2D {
    constructor(width, height, mat = new Array(width * height).fill(0)) {
        //console.log(width, height);
        super(width, height);
        this.array = [...mat];
    }
    get matrix() {
        return this.array;
    }
    set matrix(mat) {
        this.array = mat;
    }
    get Float32Array() {
        let arr = new Float32Array(this.width * this.height);
        for (var i = 0; i < arr.length; i++) {
            arr[i] = this.array[i];
        }
        return arr;
    }
    get length() {
        return this.width * this.height;
    }
    apply(arr) {
        for (var i = 0; i < this.length; i++) {
            arr[i] = this.array[i];
        }
    }
}


const Matrices = {
    array: {
        mult: function (a1, a2, w1, h1, w2, h2) {
            let m1 = new Matrix(w1, h1);
            let m2 = new Matrix(w2, h2);
            m1.array = a1;
            m2.array = a2;
            return Matrices.mult(m1, m2);
        }
    },
    identity: function (or, ory = or) {
        let mat = new Matrix(or, ory);
        let mn = min(or, ory);
        for (var i = 0; i < mn; i++) {
            mat.set(i, i, 1);
        }
        return mat;
    },
    scalar: function (or, sc, ory = or) {
        let mat = new Matrix(or + 1, ory + 1);
        let mn = min(or, ory);
        for (var i = 0; i < mn; i++) {
            mat.set(i, i, sc);
        }
        return mat;
    },
    add: function (m1, m2) {
        if (m1.width == m2.width && m1.height == m2.height) {
            let nM = new Matrix(m1.width, m2.height);
            nM.matrix = ArrayMath.add(m1.matrix, m2.matrix);
            return nM;
        }
    },
    mult: function (...args) {
        let m2 = args.pop();
        //console.log(args);
        while (args.length > 0) {
            let m1 = args.pop();
            //console.log(m1, m2);
            if (m1.width == m2.height) {
                let ans = new Matrix(m2.width, m1.height);
                for (var i = 0; i < m1.height; i++) {
                    for (var j = 0; j < m2.width; j++) {
                        let arr1 = m1.getRow(i);
                        let arr2 = m2.getCol(j);
                        let arr = ArrayMath.mult(arr1, arr2);
                        let num = ArrayMath.number(arr);
                        ans.set(j, i, num);
                    }
                }
                //console.log(ans);
                m2 = ans;
            } else {
                return undefined;
            }

        }
        return m2;
    },
    rotation2: function (ang) {
        ang = (ang + 360) % 360;
        return new Matrix(2, 2, [
            cos(ang), -sin(ang),
            sin(ang), cos(ang)
        ]);
    },
    rotationZ: function (ang) {
        ang = (ang + 360) % 360;
        return Rotation.matrix(3, 0, 1, ang);
    },
    rotationX: function (ang) {
        ang = (ang + 360) % 360;
        let mat = Rotation.matrix(3, 1, 2, ang);
        return mat;
    },
    rotationY: function (ang, log = false) {
        ang = (ang + 360) % 360;
        let mat = Rotation.matrix(3, 0, 2, ang);
        if (ang != 0 && log) {
            //console.log(mat.array);
        }
        return mat;
    },
    det2: function (mat) {
        return mat[0] * mat[3] - mat[1] * mat[2];
    },
    adjoint2: function (mat) {
        return [mat[3], -mat[1], -mat[2], mat[0]];
    },
    inverse2: function (mat) {
        console.log(this.det2(mat));
        let mat2 = ArrayMath.scalar.mult(this.adjoint2(mat), 1 / this.det2(mat));
        //console.log(mat2);
        return mat2;
    },
    lookAt: function (up, forward, pos) {
        up.normalize();
        forward.normalize();
        let x = Vector3D.crossProduct(up, forward);
        x.normalize();
        return new Matrix(4, 4, [
            x.x, up.x, forward.x, 0,
            x.y, up.y, forward.y, 0,
            x.z, up.z, forward.z, 0,
            0, 0, 0, 1
        ]);
    },
    transform3: function (t, s, r) {
        let rot = this.rotation3(r.x, r.y, r.z);
        let trans = this.translate3(t.x, t.y, t.z);
        //console.log(trans.grid());
        let scaling = this.getScaling3(s.x, s.y, s.z);
        let mat = this.mult(scaling, rot,trans);
        return mat;
    },
    translate3: function (x, y, z) {
        let mat = Matrices.identity(4);
        mat.set(0, 3, x);
        mat.set(1, 3, y);
        mat.set(2, 3, z);
        return mat;
    },
    getScaling3: function (x, y, z) {
        return this.diagonal(x, y, z, 1);
    },
    rotation3: function (x, y, z) {
        let xr = this.rotationX(x);
        let yr = this.rotationY(y);
        let zr = this.rotationZ(z);
        let mat;
        if (this.rotationMode == Rotation.XYZ) {
            mat = Matrices.mult(zr, yr, xr);
        }
        if (this.rotationMode == Rotation.XZY) {
            mat = Matrices.mult(yr, zr, xr);
        }
        if (this.rotationMode == Rotation.YXZ) {
            mat = Matrices.mult(zr, xr, yr);
        }
        if (this.rotationMode == Rotation.YZX) {
            mat = Matrices.mult(xr, zr, yr);
        }
        if (this.rotationMode == Rotation.ZXY) {
            mat = Matrices.mult(yr, xr, zr);
        }
        if (this.rotationMode == Rotation.ZYX) {
            mat = Matrices.mult(xr, yr, zr);
        }
        return mat;
    },
    rotationMode: 0,
    diagonal: function (...args) {
        let mat = new Matrix(args.length, args.length);
        for (var i = 0; i < args.length; i++) {
            mat.set(i, i, args[i]);
        }
        return mat;
    },
    transform2t2: function (vec, mat) {
        let x = vec.x;
        let y = vec.y;
        let ix = mat[0];
        let iy = mat[2];
        let jx = mat[1];
        let jy = mat[3];
        return new Vector2(x * ix + y * jx, x * iy + y * jy);
    }
}
const Rotation = {
    matrix: function (or, r1, r2, ang) {
        ang = (360 + ang) % 360;
        //console.log(or);
        let mat = Matrices.identity(or + 1);
        let mn = min(r1, r2);
        let mx = max(r1, r2);
        mat.set(mn, mn, cos(ang));
        mat.set(mx, mn, -sin(ang));
        mat.set(mn, mx, sin(ang));
        mat.set(mx, mx, cos(ang));
        return mat;
    },
    XYZ: 0,
    XZY: 1,
    YXZ: 2,
    YZX: 3,
    ZXY: 4,
    ZYX: 5,
}
var m22;
Camera.projectionMatrix = Matrices.identity(4);
// #endregion