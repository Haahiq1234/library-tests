const o = new Vector2(200, 200);
const THIGH = 70;
const CALF = 80;


class Root {
    constructor(x, y) {
        this.gizmo = new Gizmo(x, y);
        this.children = [];
        this.center = this.add(o.x, o.y);
        this.waist = this.center.add(-90, 50);
        this.chest = this.waist.add(0, 50);
        this.neck =  this.chest.add(0, 35);
        this.rightFoot = this.add(o.x + 25, o.y + 100);
        this.leftFoot = this.add(o.x - 25, o.y + 100);

        this.rightLeg = [new Vector2(0, 0), new Vector2(THIGH, 0), new Vector2(THIGH + CALF, 0)];
        this.leftLeg = [new Vector2(0, 0), new Vector2(THIGH, 0), new Vector2(THIGH + CALF, 0)];
        //waist.setParent();
    }
    get position() {
        return this.gizmo.localPosition;
    }
    draw() {
        let center = this.center.position;

        let rightFootPos = this.rightFoot.gizmo.position;
        let leftFootPos = this.leftFoot.gizmo.position;


        IK(this.rightLeg, Vector.sub(this.rightFoot.gizmo.position, center));
        IK(this.leftLeg, Vector.sub(this.leftFoot.gizmo.position, center));

        for (var i = 0; i < this.rightLeg.length - 1; i++) {
            let al = Vector.add(center, this.leftLeg[i]);
            let bl = Vector.add(center, this.leftLeg[i + 1]);
            line(al.x, al.y, bl.x, bl.y);

            let ar = Vector.add(center, this.rightLeg[i]);
            let br = Vector.add(center, this.rightLeg[i + 1]);
            line(ar.x, ar.y, br.x, br.y);
        }
        let npos = this.neck.position;
        circle(npos.x, npos.y, 20);
        for (var child of this.children) {
            child.draw();
        }
    }
    add(x, y) {
        let child = new PivotRoot(x, y, this);
        this.children.push(child);
        return child;
    }
}

class PivotRoot {
    constructor(x, y, root) {
        this.root = root;
        this.gizmo = new Gizmo(x, y);
        this.gizmo.setParent(this.root.gizmo);
        this.children = [];
    }
    add(localAngle, length) {
        let child = new Pivot(localAngle, length, this);
        this.children.push(child);
        return child;
    }
    draw() {
        let pos = this.position;
        for (var child of this.children) {
            child.draw(pos);
        }
    }
    get angle() {
        return 0;
    }
    get position() {
        return Vector.add(this.gizmo.localPosition, this.gizmo.parent.localPosition);
    }
}

class Pivot {
    constructor(localAngle, length, parent) {
        this.localAngle = localAngle;
        this.length = length;
        this.parent = parent;

        let angle = localAngle + parent.angle;
        this.gizmo = new Gizmo(cos(angle) * length, sin(angle) * length);
        let ths = this;
        this.gizmo.bind("move", function (gizmo) {
            ths.angle = gizmo.localPosition.heading();
            ths.recalculate(ths.parent.angle);
        });
        this.gizmo.setParent(this.parent.gizmo, false);

        this.children = [];
    }
    draw(parpos) {
        let pos = this.position;
        line(pos.x, pos.y, parpos.x, parpos.y);
        for (var child of this.children) {
            child.draw(pos);
        }
    }
    add(localAngle, length) {
        let child = new Pivot(localAngle, length, this);
        this.children.push(child);
        return child;
    }
    get angle() {
        return this.localAngle + this.parent.angle;
    }
    set angle(angle) {
        this.localAngle = angle - this.parent.angle;
    }
    get position() {
        return Vector.add(this.parent.position, Vector.AngleToVector(this.angle, this.length));
    }
    recalculate(ang) {
        let angle = this.localAngle + ang;
        this.gizmo.localPosition = new Vector2(cos(angle) * this.length, sin(angle) * this.length);
        for (var child of this.children) {
            child.recalculate(angle);
        }
    }
}