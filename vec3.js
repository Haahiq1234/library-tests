class vec3 {
    static add(a, b) {
        return [a[0] + a[0], a[1] + a[1], a[2] + b[2]];
    }
}

class Camera {
    static position = new Vector3(0, 0, -10);
    static update() {
        let forward = new Vector3(0, 0, 1)
            .rotate(this.rotationx, this.rotationy, this.rotationz)
            .mult(-GetAxis("vertical") * this.zSpeed);
        let right = new Vector3(1, 0, 0)
            .rotate(this.rotationx, this.rotationy, this.rotationz)
            .mult(GetAxis("horizontal", "key") * this.xSpeed);
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
        this.projectionMatrix = Matrices.mult(
            Rotation.matrix(3, 2, 1, xr),
            this.projectionMatrix
        );
        this.projectionMatrix = Matrices.mult(
            Rotation.matrix(3, 0, 2, yr),
            this.projectionMatrix
        );
        this.projectionMatrix = Matrices.mult(
            Rotation.matrix(3, 0, 1, zr),
            this.projectionMatrix
        );
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
    }
    static worldRotation = {
        x: 0,
        y: 0,
        z: 0,
    };
    static resetWorldRotation() {
        this.worldRotation = {
            x: 0,
            y: 0,
            z: 0,
        };
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
    }
    static worldRotation = {
        x: 0,
        y: 0,
        z: 0,
    };
    static resetWorldRotation() {
        this.worldRotation = {
            x: 0,
            y: 0,
            z: 0,
        };
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

function createVector3(x = 0, y = 0, z = 0) {
    return new Vector3(x, y, z);
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
    },
};

function Vector3(x = 0, y = x, z = x) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.copy = function () {
        return new Vector3(this.x, this.y, this.z);
    };
    this.add = function (vec) {
        this.y += vec.y || 0;
        this.x += vec.x || 0;
        this.z += vec.z || 0;
        return this;
    };
    this.neg = function () {
        return new Vector3(-this.x, -this.y, -this.z);
    };
    this.normalize = function () {
        let m = this.mag();
        if (m == 0) {
            m = 1;
        }
        this.div(m);
        return this;
    };
    this.mult = function (t) {
        this.x *= t;
        this.y *= t;
        this.z *= t;
        return this;
    };
    this.div = function (t) {
        this.mult(1 / t);
        return this;
    };
    this.mag = function () {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    };
    this.setMag = function (m) {
        this.normalize().mult(m);
        return this;
    };
    this.sub = function (vec) {
        //console.log(vec);
        this.add(vec.neg());
        return this;
    };
    this.array = function () {
        return [this.x, this.y, this.z];
    };
    this.matrix = function () {
        return new Matrix(1, 4, [...this.array(), 1]);
    };
    this.transform = function (mat1) {
        //console.log(mat1, this.matrix());
        let mat = Matrices.mult(mat1, this.matrix());
        //console.log(mat1.array, mat.array);
        let arr = mat.array;
        this.x = arr[0];
        this.y = arr[1];
        this.z = arr[2];
        return this;
    };
    this.rotationX = function () {
        let vec = new Vector2(this.z, this.y);
        let ang = vec.heading();
        vec.rotate(-ang);
        return ang;
    };
    this.Vector2 = function () {
        return new Vector2(this.x, this.y);
    };
    this.rotated = function (ax, ay, az) {
        let v = this.copy();
        v.rotate(ax, ay, az);

        return v;
    };
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
    };
    this.persp = function () {
        let vec = this.fromCamera();
        let z = 1 / vec.z;
        if (z <= 0) {
            z *= -1;
            z *= CanvasWidth;
        }
        let projmat = new Matrix(4, 4, [
            z,
            0,
            0,
            0,
            0,
            z,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,
        ]);
        let mat = Matrices.mult(projmat, vec.matrix()).array;
        return new Vector3(mat[0], mat[1], mat[2]);
    };
    this.fromCamera = function () {
        let vec = this.copy();
        vec.rotate(
            -Camera.worldRotation.x,
            -Camera.worldRotation.y,
            -Camera.worldRotation.z
        );
        vec.sub(Camera.position);
        vec.rotate(
            360 - Camera.rotationx,
            360 - Camera.rotationy,
            360 - Camera.rotationz
        );
        return vec;
    };
    this.ortho = function () {
        let vec = this.copy();
        vec.rotate(
            -Camera.worldRotation.x,
            -Camera.worldRotation.y,
            -Camera.worldRotation.z
        );
        vec.sub(Camera.position);
        let projmat = Camera.projectionMatrix;
        let mat = Matrices.mult(projmat, vec.matrix()).array;
        return new Vector3(mat[0], mat[1], mat[2]);
    };
    this.index = function () {
        return parseInt(this.x) + ":" + parseInt(this.y) + ":" + parseInt(this.z);
    };
    //console.log(this.ortho());
}

on.start.bind(function () {
    Camera.projectionMatrix = Matrices.identity(4);
});

on.draw.bind(function () {
    Camera.update();
});

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
    ox -= cx;
    oy -= cy;
    oz -= cz;
    let orig = createVector3(ox, oy, oz);
    let dir = createVector3(rx, ry, rz);
    let cv = createVector3(cx, cy, cz);

    let a = Vector.dot(dir, dir);
    let b = 2 * Vector.dot(dir, orig);
    let c = Vector.dot(orig, orig) - cr ** 2;
    let eq = QuadraticFormula(a, b, c);
    let arr = [];
    for (var i = 0; i < eq.length; i++) {
        if (eq[i] >= 0) {
            //console.log(eq[i]);
            let p = cv.add(orig.copy().add(dir.copy().mult(eq[i])));
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
    let t =
        (-a * av.x - b * av.y - c * av.z + d) / (a * bv.x + b * bv.y + c * bv.z);
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
    let t =
        (-a * av.x - b * av.y - c * av.z + d) / (a * bv.x + b * bv.y + c * bv.z);
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