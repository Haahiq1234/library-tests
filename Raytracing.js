
function rayAt(x, y) {
    let r = Camera2.dir.copy();
    //x -= CanvasWidth / 2;
    //y -= CanvasHeight / 2;
    let angx = map(x, 0, CanvasWidth, -xfov / 2, xfov / 2);
    let angy = map(y, 0, CanvasHeight, -yfov / 2, yfov / 2);
    r.rotate(angy, angx, 0);
    let o = Camera2.pos.copy();//.add(createVector3(x, y, 0));
    //console.log(o, r);
    return [o, r];
}
class Sphere {
    static spheres = [];
    static cast(o, r, t) {
        let len = Infinity;
        let fc = [undefined, undefined];
        for (var i = 0; i < Sphere.spheres.length; i++) {
            let cast = Sphere.spheres[i].cast(o, r, t);
            if (cast[0]) {
                let d = Vector.dist(cast[0], o);
                if (d < len) {
                    fc = cast;
                    len = d;
                }
            }
        }
        //console.log(fc);
        return fc;
    }
    constructor(x, y, z, r) {
        this.p = createVector3(x, y, z);
        this.r = r;
        this.color = [255, 127.5, 0, 255];
        Sphere.spheres.push(this);
    }
    get x() {
        return this.p.x;
    }
    get y() {
        return this.p.y;
    }
    get z() {
        return this.p.z;
    }
    cast(o, r, t) {
        //console.log(r.z);
        let cast = sphereCast(o.x, o.y, o.z, r.x, r.y, r.z, this.x, this.y, this.z, this.r);
        let pt;
        let len = Infinity;
        for (var i = 0; i < cast.length; i++) {
            let d = Vector.dist(cast[i], o);
            if (d < len) {
                len = d;
                pt = cast[i];
            }
        }
        if (pt) {
            //if (t > 0) {
            //    //console.log(pt, th);
            //    let norm = Vector.sub(pt, this.p).normalize();
            //    let reflected = reflection(r, norm);
            //    let p2 = RayTrace(pt, reflected, t - 1);
            //    if (p2[0]) {
            //        console.log(p2[1]);
            //        return [pt, p2[1]];
            //    }
            //}
            return [pt, [...this.color]];
        }
        return [pt, [...this.color]];
    }
}
class Mesh2 {
    static meshes = [];
    static cast(o, r) {
        let len = Infinity;
        let fc = [undefined, undefined];
        for (var i = 0; i < Mesh2.meshes.length; i++) {
            let cast = Mesh2.meshes[i].cast(o, r);
            //console.log(Mesh2.meshes.length);
            if (cast[0]) {
                let d = Vector.dist(cast[0], o);
                if (d < len) {
                    fc = cast;
                    len = d;
                }
            }
        }
        //console.log(fc);
        return fc;
    }
    constructor() {
        this.indices = [];
        this.vertices = [];
        this.colors = [];
        Mesh2.meshes.push(this);
    }
    cast(o, r) {
        let len = Infinity;
        var ans;
        var col;
        for (var i = 0; i < this.indices.length; i += 3) {
            let av = this.vertices[this.indices[i]];
            let bv = this.vertices[this.indices[i + 1]];
            let cv = this.vertices[this.indices[i + 2]];
            //console.log(av, bv, cv);
            let cast = RaycastFace(o, r, av, bv, cv);
            //console.log(cast);
            if (cast) {
                let d = Vector.dist(cast, o);
                if (d < len) {
                    len = d;
                    col = [...this.colors[i / 3]];
                    ans = cast;
                }
            }
        }
        //console.log(ans, col);
        return [ans, col];
    }
}
class Camera2 {
    static pos = createVector3(0, 0, -5);
    static dir = createVector3(0, 0, 1);
}


