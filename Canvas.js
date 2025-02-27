// #region Vector
const polar = {
    fromVector: function (v) {
        return [atan2(v.y, v.x), v.mag()];
    },
    toVector: function (p) {
        return Vector.AngleToVector(p[0], p[1]);
    },
    armToVector: function (arm, ni = arm.length - 1, o = Vector.zero) {
        let ans = o.copy();
        for (var i = 0; i < arm.length; i++) {
            ans.add(this.toVector(arm[i]));
            if (ni == i) {
                return ans;
            }
        }
        return ans;
    },
    armToPoints: function (arm, o = Vector.zero) {
        let ans = [o.copy()];
        for (var i = 0; i < arm.length; i++) {
            ans.push(Vector.add(this.toVector(arm[i]), ans[ans.length - 1]));
        }
        return ans;
    },
};
const vec2 = {
    add: function ([ax, ay], [bx, by]) {
        return [ax + bx, ay + by];
    },
    sub: function ([ax, ay], [bx, by]) {
        return [ax - bx, ay - by];
    },
    mult: function ([ax, ay], s) {
        return [ax * s, ay * s];
    },
    dist: function ([ax, ay], [bx, by]) {
        return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
    },
    mag: function ([x, y]) {
        return Math.sqrt(x * x + y * y);
    },
};
function createVector(x = 0, y = 0) {
    return new Vector2(x, y);
}
class Vector2 {
    constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
        this.add = function (addition) {
            this.x += addition.x;
            this.y += addition.y;
            return this;
        };
        this.array = function () {
            return [this.x, this.y];
        };
        this.mult = function (mx, my = mx) {
            this.x *= mx;
            this.y *= my;
            return this;
        };
        this.reset = function () {
            this.x = 0;
            this.y = 0;
            return this;
        };
        this.sub = function (vec) {
            this.x -= vec.x;
            this.y -= vec.y;
            return this;
        };
        this.rotate = function (ang) {
            let ax = cos(ang);
            let ay = sin(ang);
            return this.set(this.x * ax - this.y * ay, this.x * ay + this.y * ax);
        };
        this.set = function (nx, ny) {
            this.x = nx;
            this.y = ny;
            return this;
        };
        this.setMag = function (len) {
            return this.normalize().mult(len);
        };
    }
    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    copy() {
        return new Vector2(this.x, this.y);
    }
    normalize() {
        return this.div(this.mag() | 1);
    }
    div(no) {
        if (no == 0) {
            //console.trace("Division by zero");
            this.x = 0;
            this.y = 0;
            return this;
        }
        this.x /= no;
        this.y /= no;
        return this;
    }
    neg() {
        return new Vector2(-this.x, -this.y);
    }
    limit(no) {
        if (this.mag() > no) this.setMag(no);
        return this;
    }
    heading() {
        return Vector.heading(this);
    }
    index() {
        return parseInt(this.x) + ":" + parseInt(this.y);
    }
}
const Vector = {
    zero: new Vector2(0, 0),
    dist2: function (a, b) {
        let dx = abs(a.x - b.x);
        let dy = abs(a.y - b.y);
        return max(dx, dy) + min(dx, dy) * (Math.SQRT2 - 1);
    },
    distM: function (a, b) {
        let dx = abs(a.x - b.x);
        let dy = abs(a.y - b.y);
        return dx + dy;
    },
    derp: function (a, b, dist) {
        let ab_dist = Vector.dist(a, b);
        if (ab_dist < dist) {
            return b.copy();
        }
        return this.lerp(a, b, dist / ab_dist);
    },
    InFov(p, o, d, fov) {
        let dot = Vector.dot(d.copy().normalize(), Vector.sub(p, o).normalize());
        if (dot >= cos(fov / 2)) {
            return true;
        }
        return false;
    },
    flip(p, a, b) {
        let ab = Vector.sub(b, a);
        let ap = Vector.sub(p, a);
        return Vector.sub(
            Vector.add(a, ab.setMag(Vector.dot(ap, ab) / ab.mag())).mult(2),
            p
        );
    },
    Equal(a, b) {
        return Boolean(a) && Boolean(b) && a.x == b.x && a.y == b.y;
    },
    fromIndex(str) {
        let arr = str.split(":");
        let x = arr[0];
        let y = arr[1];
        return new Vector2(x, y);
    },
    array(...vecs) {
        let ans = [];
        for (var vec of vecs) {
            ans.push(vec.x, vec.y);
        }
        return ans;
    },
    cross(a, b) {
        return a.x * b.y - b.x * a.y;
    },
    setRotation(v, rot) {
        let c = Vector.sub(b, a);
        c.setRotation(rot);
        return Vector.add(a, c);
    },
    interpolateArray(arr, index) {
        let i = floor(index);
        let ir = index - i;
        let ans = arr[i].copy();
        if (i < arr.length - 1 && ir > 0) {
            let subbed = Vector.sub(arr[i + 1], ans);
            ans.add(Vector.mult(subbed, ir));
        }
        return new Vector2(ans.x, ans.y);
    },
    setMag(vec, mag) {
        return new Vector2(vec.x, vec.y).setMag(mag);
    },
    fromArray(...verts) {
        let arr = [];
        for (var i = 0; i < verts.length; i += 2) {
            arr.push(createVector(verts[i], verts[i + 1]));
        }
        return arr;
    },
    InSquare(a, b, p) {
        if (p.x >= a.x && p.y >= a.y && p.x <= b.x && p.y <= b.y) {
            return true;
        }
        return false;
    },
    fromOrigin: {
        farthest(o, arr) {
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

        nearest(o, arr) {
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
        },
    },
    mid(a, b) {
        return new Vector2((a.x + b.x) / 2, (a.y + b.y) / 2);
    },
    normal2(a, b, c) {
        let ao = Vector.sub(a, b);
        let co = Vector.sub(c, b);
        let aoh = ao.heading();
        let coh = co.heading();
        let mid = avg(aoh, coh);
        mid += 180;
        return Vector.AngleToVector(mid, 1);
    },
    reflect(v, n) {
        let d = -Vector.dot(v, n) / n.mag();
        let p = Vector.setMag(n, d);
        return new Vector2(2 * p.x + v.x, 2 * p.y + v.y);
    },
    copy(vec) {
        //if (Vector3 && vec instanceof Vector3) {
        //    return new Vector3(vec.x, vec.y, vec.z);
        //}
        return new Vector2(vec.x, vec.y);
    },
    normal(a, b, p) {
        let v = new Vector2(-(b.y - a.y), b.x - a.x);
        return v.mult((p.x - a.x) * v.x + (p.y - a.y) * v.y).normalize();
    },
    constraint(p, a, b) {
        let x = constraint(p.x, a.x, b.x);
        let y = constraint(p.y, a.y, b.y);
        return createVector(x, y);
    },
    interpolate(a, b, t, f = (x) => x) {
        //console.log(f(t));
        return Vector.lerp(a, b, f(t));
    },
    lerp(a, b, t) {
        return new Vector2(a.x * (1 - t) + b.x * t, a.y * (1 - t) + b.y * t);
    },
    mult(v, m) {
        return new Vector2(v.x * m, v.y * m);
    },
    min(...args) {
        let x = args[0].x;
        let y = args[0].y;
        for (var i = 1; i < args.length; i++) {
            x = min(x, args[i].x);
            y = min(y, args[i].y);
        }
        return new Vector2(x, y);
    },
    max(...args) {
        let x = args[0].x;
        let y = args[0].y;
        for (var i = 1; i < args.length; i++) {
            x = max(x, args[i].x);
            y = max(y, args[i].y);
        }
        return new Vector2(x, y);
    },
    neg(vec) {
        return new Vector2(-vec.x, -vec.y);
    },
    avg(...vector2Array) {
        let x = 0;
        let y = 0;
        for (var i = 0; i < vector2Array.length; i++) {
            x += vector2Array[i].x;
            y += vector2Array[i].y;
        }
        return new Vector2(x / vector2Array.length, y / vector2Array.length);
    },
    add(...vectorArray) {
        let x = 0;
        let y = 0;
        for (var i = 0; i < vectorArray.length; i++) {
            x += vectorArray[i].x;
            y += vectorArray[i].y;
        }
        return new Vector2(x, y);
    },
    sub(a, b) {
        return new Vector2(a.x - b.x, a.y - b.y);
    },
    heading(vec) {
        if (vec.x == 0 && vec.y == 0) {
            return 0;
        }
        var ang = atan2(vec.y, vec.x);
        return ang;
    },
    dot(a, b) {
        return a.x * b.x + a.y * b.y;
    },
    AngleToVector(ang, rad = 1) {
        let x = rad * cos(ang);
        let y = rad * sin(ang);
        return new Vector2(x, y);
    },
    div(v, no) {
        if (no == 0) {
            console.log("Dividing by 0");
            return new Vector2(0, 0);
        }
        return new Vector2(v.x / no, v.y / no);
    },
    randomVelocity(minSpeed, maxSpeed) {
        return this.AngleToVector(
            Random.range(0, 360),
            Random.range(minSpeed, maxSpeed)
        );
    },
    random(aMag, bMag, aAngle = 0, bAngle = 360) {
        let r = Random.range(aMag, bMag);
        let a = Random.range(aAngle, bAngle);
        return Vector.FromAngle(a, r);
    },
    directionVector(a, b) {
        let d = new Vector2(b.x - a.x, b.y - a.y).normalize();
        return d;
    },
    FromAngle(an, r = 1) {
        return new Vector2(cos(an) * r, sin(an) * r);
    },
    angle(a, b) {
        return this.directionVector(a, b).heading();
    },
    dist(a, b) {
        return mag(a.x - b.x, a.y - b.y);
        //return mag(a.x - b.x, a.y - b.y);
    },
    limitDistance(a, b, lim) {
        let c = Vector.sub(b, a);
        c.limit(lim);
        return Vector.add(a, c);
    },
    setDist(a, b, dst) {
        let c = this.sub(b, a);
        let ang = c.heading();
        let d = this.AngleToVector(ang, dst);
        return this.add(a, d);
    },
};
// #endregion

// #region Misc
function downloadFromURL(url, filename = "download") {
    let a = document.createElement("a");
    a.download = filename;
    a.href = url;
    a.click();
}
function IsMobile() {
    return navigator.userAgentData.mobile;
}
function download(filename, text) {
    var element = document.createElement("a");
    element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);
    element.click();
}
function print(...messages) {
    Debug.Log(...messages);
}
{
    let storageTypes = [];
    let suffix = "_ItemType";
    function storeItem(key, item) {
        let type = typeof item;
        if (type == "object") {
            for (var name of storageTypes) {
                if (item instanceof storageTypes[name].type) {
                    localStorage.setItem(key + suffix, name);
                    break;
                }
            }
        }
        if (type == "string") {
            localStorage.setItem(key + suffix, "string");
        }
        localStorage.setItem(key, JSON.stringify(item));
    }
    function getItem(key) {
        let type = localStorage.getItem(key + suffix);
        let item = JSON.parse(localStorage.getItem(key));
        if (item != null) {
            console.log(item);
            item = storageTypes[type].parse(...Object.values(item));
        }
        return item;
    }
    function removeItem(key) {
        localStorage.removeItem(key);
        localStorage.removeItem(key + suffix);
    }
    function setStorageItemType(
        name,
        type,
        parse = (...args) => new type(...args)
    ) {
        storageTypes[name] = {
            type,
            parse,
        };
    }
    setStorageItemType("Vector2", Vector2);
}
function loadFile(url, callback, id = 0) {
    Sketch.LOADING++;
    let request = new XMLHttpRequest();
    //console.log(request);
    request.open("GET", url, true);
    request.onload = function () {
        if (request.status < 200 || request.status > 299) {
            callback(null, true, id);
        } else {
            callback(request.responseText, false, id);
        }
        Sketch.LOADING--;
        Sketch.tryStart();
    };
    request.send();
}
function loadFiles(urls, callback) {
    var loadingItems = urls.length;
    let resources = [];
    let errors = [];
    for (var i = 0; i < urls.length; i++) {
        var url = urls[i];
        loadFile(
            url,
            function (text, error, id) {
                loadingItems--;
                if (!error) {
                    resources[id] = text;
                } else {
                    errors.push(id);
                }
                if (loadingItems == 0) {
                    callback(resources, errors);
                }
            },
            i
        );
    }
}
// #endregion

// #region Events
const EVENT_PREVENT_DEFAULT = "EVENT_PREVENT_DEFAULT";
class EventHandler {
    bound;
    constructor() {
        this.bound = [];
        this.args = [];
        this.names = [];
        this.continuing = false;
    }
    bind(func, args = [], name = this.names.length) {
        this.bound.push(func);
        this.args.push(args);
        this.names.push("" + name);
    }
    unbind(name) {
        let ind = this.names.find(name);
        this.names.splice(ind, 1);
        this.args.splice(ind, 1);
        this.bound.splice(ind, 1);
    }
    Fire(...args) {
        let toReturns = {};
        for (var i = 0; i < this.bound.length; i++) {
            let toReturn = this.bound[i](...this.args[i], ...args);
            if (toReturn == EVENT_PREVENT_DEFAULT) {
                return toReturns;
            }
            toReturns[this.names[i]] = toReturn;
        }
        return toReturns;
    }
}
const on = {
    click: new EventHandler(),
    mousemove: new EventHandler(),
    pointermove: new EventHandler(),
    start: new EventHandler(),
    update: new EventHandler(),
    draw: new EventHandler(),
    mousedown: new EventHandler(),
    pointerdown: new EventHandler(),
    mouseup: new EventHandler(),
    pointerup: new EventHandler(),
    key: new EventHandler(),
    keydown: new EventHandler(),
    keyup: new EventHandler(),
    wheel: new EventHandler(),
};
{
    var startPosition;
    var startTime;
    document.onpointermove = function (event) {
        event.preventDefault();
        on.pointermove.Fire(event.clientX, event.clientY, event);
        on.mousemove.Fire(event.clientX, event.clientY, event);
    };
    document.onpointerup = function (event) {
        event.preventDefault();
        let x = event.clientX;
        let y = event.clientY;
        on.pointerup.Fire(
            x,
            y,
            startPosition.x,
            startPosition.y,
            Time.time - startTime,
            event
        );
        on.mouseup.Fire(
            x,
            y,
            startPosition.x,
            startPosition.y,
            Time.time - startTime,
            event
        );
        on.click.Fire(
            x,
            y,
            startPosition.x,
            startPosition.y,
            Time.time - startTime,
            event
        );
        Mouse.pressed = 0;
    };
    document.onpointercancel = function (event) {
        event.preventDefault();
        Mouse.pressed = 0;
        let x = event.clientX;
        let y = event.clientY;
        on.pointerup.Fire(
            x,
            y,
            startPosition.x,
            startPosition.y,
            Time.time - startTime,
            event
        );
        on.mouseup.Fire(
            x,
            y,
            startPosition.x,
            startPosition.y,
            Time.time - startTime,
            event
        );
        on.click.Fire(
            x,
            y,
            startPosition.x,
            startPosition.y,
            Time.time - startTime,
            event
        );
    };
    document.onpointerdown = function (event) {
        event.preventDefault();
        startTime = Time.time;
        startPosition = new Vector2(event.clientX, event.clientY);
        Mouse.pressed = event.buttons;
        on.pointerdown.Fire(event.clientX, event.clientY, event);
        on.mousedown.Fire(event.clientX, event.clientY, event.buttons, event);
    };
    document.onkeyup = function (event) {
        keyCode = event.key;
        on.key.Fire(keyCode, event);
        Input.pressed[keyCode] = false;
        on.keyup.Fire(event.key, event);
    };
    document.onkeydown = function (event) {
        keyCode = event.key;
        if (!Input.pressed[keyCode]) {
            on.keydown.Fire(event.key, event);
            Input.pressed[keyCode] = true;
        }
    };
    document.onwheel = function (event) {
        on.wheel.Fire(event.deltaY / -100, event);
    };
}
// #endregion

// #region Debug
const Debug = {
    isMobile: IsMobile(),
    intitialized: false,
    element: undefined,
    init: function () {
        this.intitialized = true;
        this.element = document.createElement("div");
        document.body.appendChild(this.element);
    },
    Log: function (...messages) {
        if (this.isMobile) {
            if (!this.intitialized) {
                this.init();
            }
            for (var message of messages) {
                this.element.innerHTML += message;

            }
        } else {
            console.log(...messages);
        }
    }
}
// #endregion

// #region Keyboard 
{
    const onkeyqueue = {};
    function addHotKey(key, func) {
        if (onkeyqueue[key]) {
            onkeyqueue[key].push(function () { func() });
        } else {
            onkeyqueue[key] = [function () { func() }];
        }
        console.log(onkeyqueue);
    }
    class SentenceCommand {
        constructor(sentence, func) {
            this.func = func;
            this.sentence = sentence;
            this.current = 0;
        }
        check(key) {
            if (this.sentence[this.current] == key) {
                this.current++;
                if (this.current == this.sentence.length) {
                    this.current = 0;
                    this.func();
                }
                return true;
            } else {
                this.current = 0;
            }
            return false;
        }
    }
    const sentenceCommands = [];
    function addSentenceCommand(sentence, func) {
        sentenceCommands.push(new SentenceCommand(sentence, func));
    }
    on.keydown.bind(function (key) {
        for (var sentenceCommand of sentenceCommands) {
            sentenceCommand.check(key);
        }
        if (onkeyqueue[key]) {
            let obj = onkeyqueue[key];
            if (obj && obj.length > 0) {
                for (var func of obj) {
                    func();
                }
            }
        }
    });
    addSentenceCommand("stop", noLoop);
    addSentenceCommand("start", loop);
}
// #endregion

// #region Input
const Input = {
    pressed: {}
}
function disableContextMenu() {
    document.oncontextmenu = function (event) {
        if (Canvas.enabled && event.clientX >= 0 && event.clientY >= 0 && event.clientX <= CanvasWidth && event.clientY <= CanvasHeight) {
            event.preventDefault();
        }
    }
}
const Mouse = {
    pressed: -1,
    position: new Vector2(0, 0),
    previous: new Vector2(0, 0),
    startPress: new Vector2(0, 0),
    pressedTime: 0,
    get x() {
        return this.position.x;
    },
    get y() {
        return this.position.y;
    },
    get px() {
        return this.previous.x;
    },
    get py() {
        return this.previous.y;
    },
    get dx() {
        return -this.previous.x + this.position.x;
    },
    get dy() {
        return -this.previous.y + this.position.y;
    },
};
var mouse = new Vector2(0, 0);
var mouse2 = new Vector2(0, 0);
{
    on.pointermove.bind(function (x, y, event) {
        mouse.set(...Camera2D.invertPos(x, y));
        mouse2.set(x, y);
        for (var element of UI.Elements) {
            element.getHoveredInfo();
        }
    });
    var key = {};
    key.up = "ArrowUp";
    key.down = "ArrowDown";
    key.right = "ArrowRight";
    key.left = "ArrowLeft";
    key.space = " ";
    key.enter = "Enter";
    key.backSpace = "Backspace";
    var keyCode;
    let Axii = {
        horizontal: new Axis(key.right, key.left, "d", "a", "arrow", "key"),
        vertical: new Axis(key.down, key.up, "s", "w", "arrow", "key"),
        vertical2: new Axis("q", "e"),
    };
    function setAxis(
        name,
        pos,
        neg,
        altP = pos,
        altN = neg,
        Nm = "both",
        altNm = "both"
    ) {
        Axii[name] = new Axis(pos, neg, altP, altN, Nm, altNm);
    }
    function Axis(
        pos,
        neg,
        altP = pos,
        altN = neg,
        Nm = "both",
        altNm = "both"
    ) {
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
            let neg = -(Input.pressed[axis.neg] ?? false);
            let pos = +(Input.pressed[axis.pos] ?? false);
            return neg + pos;
        }
        if (TKey == axis.altNm || TKey == "both") {
            let neg = -(Input.pressed[axis.altN] ?? false);
            let pos = +(Input.pressed[axis.altP] ?? false);
            return neg + pos;
        }
        return 0;
    }
    {
        var keyActions = {};
        function setKeyAction(ac, ...keys) {
            keyActions[ac] = keys;
        }
        setKeyAction("jump", key.space, "w", key.up);
        setKeyAction("left", key.left, "a");
        setKeyAction("right", key.right, "d");
        setKeyAction("up", key.up, "a");
        setKeyAction("down", key.down, "s");
        function GetKeyAction(nm) {
            let ac = keyActions[nm];
            for (var i = 0; i < ac.length; i++) {
                if (GetKey(ac[i])) {
                    return true;
                }
            }
            return false;
        }
    }
    on.pointerdown.bind(function (x, y) {
        mousePressed = true;
        Mouse.pressedTime = new Date();
        Mouse.startPress.set(x, y);
        mouse.set(...Camera2D.invertPos(x, y));
        mouse2.set(x, y);
    });
    on.pointerup.bind(function () {
        mousePressed = false;
    });
    function GetKey(keyCode) {
        return Boolean(Input.pressed[keyCode]);
    }
} // code
//#endregion

// #region constants
const CONSTANTS = {};
const SPACE = " ";
Object.freeze(CONSTANTS);
const PI = Math.PI;
const RGB = 0;
const HSB = 1;
const HSL = 2;
const TEXT = {};
TEXT.CENTER = "center";
TEXT.MIDDLE = "middle";
TEXT.RIGHT = "right";
TEXT.LEFT = "left";
const LINE = {};
LINE.ROUND = "round";
LINE.BEVEL = "bevel";
LINE.MITER = "miter";
LINE.BUTT = "butt";
LINE.SQUARE = "square";
let DEGREES = 0;
let RADIANS = 1;
// #endregion

// #region Sketch
const Time = {
    deltaTime: 0,
    frameRate: 0,
    time: 0,
};
const Sketch = {
    LOADED: false,
    LOADING: 0,
    STARTED: false,
    FIXED_FPS: false,
    RUNNING: false,
    LOOP_ID: 0,
    FRAME_DRAWN: false,
    FRAME_NO: 0,
    loop: function () {
        if (this.RUNNING) return;
        this.RUNNING = true;
        if (this.FIXED_FPS) {
            this.LOOP_ID = setInterval(this.tryRedraw, 1000 / Time.frameRate);
        } else {
            this.LOOP_ID = requestAnimationFrame(this.tryRedraw);
        }
    },
    noLoop: function () {
        if (!this.RUNNING) return;
        this.RUNNING = false;
        if (this.FIXED_FPS) {
            clearInterval(this.LOOP_ID);
        } else {
            // console.log(this.LOOP_ID);
            cancelAnimationFrame(this.LOOP_ID);
        }
    },
    tryRedraw: function (timeStamp) {
        redraw(timeStamp);
        if (!Sketch.FIXED_FPS) {
            Sketch.LOOP_ID = requestAnimationFrame(Sketch.tryRedraw);
        }
        Sketch.FRAME_DRAWN = false;
    },
    tryStart: function () {
        //console.log(this.LOADED && this.LOADING == 0 && !this.STARTED);
        if (this.LOADED && this.LOADING == 0 && !this.STARTED) {
            this.STARTED = true;
            if (window.setUp) {
                setUp();
            }
            on.start.Fire();
            this.loop();
        }
    },
};
document.body.onload = function () {
    Sketch.LOADED = true;
    Sketch.tryStart();
};
on.start.bind(function () {
    for (var i = 0; i < UI.Elements.length; i++) {
        let element = UI.Elements[i];
        if (element.constructor == Gizmo) {
            element.a = new Vector2(0, 0);
            element.b = new Vector2(CanvasWidth, CanvasHeight);
        }
    }
});
function frameRate(rate) {
    Sketch.noLoop();
    Sketch.FIXED_FPS = true;
    Time.frameRate = rate;
    Time.deltaTime = 1000 / rate;
    Time.time = 0;
    Sketch.loop();
}
let loopGoing = true;
function noLoop() {
    Sketch.noLoop();
}
function loop() {
    Sketch.loop();
}
function redraw(timeStamp = Time.time + Time.deltaTime) {
    if (!Sketch.FIXED_FPS) {
        Time.deltaTime = timeStamp - Time.time;
        Time.frameRate = 1000 / Time.deltaTime;
        Time.time = timeStamp;
    } else {
        Time.time += Time.deltaTime;
    }
    Mouse.previous.set(Mouse.x, Mouse.y);
    Mouse.position.set(mouse2.x, mouse2.y);
    Sketch.FRAME_NO++;
    if (Canvas.enabled) {
        UI.Update();
        ctx.save();
        push();
    }
    on.update.Fire();
    if (window.draw) {
        draw();
    }
    on.draw.Fire();
    if (Canvas.enabled) {
        pop();
        UI.Draw();
    }
    if (window.lateDraw) {
        lateDraw();
    }
    if (Canvas.enabled) {
        saveColor();
        ctx.restore();
        loadColor();
        if (Canvas.recordingFrames && Canvas.autoRecordingFrames) {
            Canvas.recordFrame();
        }
    }
}
// interval stuff
// #endregion

// #region Strings
function replaceAt(str, r, i) {
    return str.slice(0, i) + r + str.slice(i + 1, str.length);
}
function insertAt(str, r, i) {
    return str.slice(0, i) + r + str.slice(i, str.length);
}
function reverse(str) {
    let ans = "";
    for (var i = 0; i < str.length; i++) {
        ans = str[i] + ans;
    }
    return ans;
}
// #endregion

// #region Math
function mag(x, y) {
    return (x * x + y * y) ** 0.5;
}
function pow(number, power) {
    return Math.pow(number, power);
}
function dist(ax, ay, bx, by) {
    return mag(bx - ax, by - ay);
}
function ciel(no, mod = 1) {
    return Math.ceil(no / mod) * mod;
}
function interpolate(a, b, t) {
    return a * (1 - t) + b * t;
}
function normalize(x, a, b) {
    return (x - a) / (b - a);
}
function ceil(no, res = 1) {
    return floor(no, res) + res;
}
function IK(arm, target) {
    target = target.copy();
    for (var i = arm.length - 1 - 1; i >= 0; i--) {
        let p = arm[i];
        let dir = Vector.sub(p, target);
        let dist = Vector.dist(arm[i], arm[i + 1]);
        arm[i + 1] = target.copy();
        target.add(Vector.AngleToVector(dir.heading(), dist));
    }
    let dt = Vector.sub(target, arm[0]);
    for (var i = 1; i < arm.length; i++) {
        arm[i].sub(dt);
    }
    return arm;
}
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
        if (inti.parallel) return;
        if (inti.intersected) {
            return inti.point;
        } else if (inti.u <= 1 && inti.u >= 0) {
            let pt = Vector.interpolate(
                new Vector2(ax, ay),
                new Vector2(bx, by),
                inti.t
            );
            return new Vector2((1 - t) * ax + t * bx, (1 - t) * ay + t * by);
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
            let ai = i / 2;
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
    CTL: function (ax, ay, bx, by, cx, cy, cr) {
        let ox = ax - cx;
        let oy = ay - cy;
        let rx = bx - ax;
        let ry = by - ay;
        let a = rx ** 2 + ry ** 2;
        let b = 2 * ox * rx + 2 * oy * ry;
        let c = ox ** 2 + oy ** 2 - cr ** 2;
        let eq = QuadraticFormula(a, b, c);
        let arr = [];
        for (var i = 0; i < eq.length; i++) {
            if (eq[i] >= 0 && eq[i] <= 1) {
                let x = cx + ox + rx * eq[i];
                let y = cy + oy + ry * eq[i];
                let p = createVector(x, y);
                arr.push(p);
            }
        }
        return arr;
    },
    CTC: function (ax, ay, ar, bx, by, br) {
        let c1 = { x: ax, y: ay, r: ar };
        let c2 = { x: bx, y: by, r: br };
        let dx = c2.x - c1.x;
        let dy = c2.y - c1.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        // Circles too far apart
        if (d > c1.r + c2.r) {
            return [];
        }

        // One circle completely inside the other
        if (d < Math.abs(c1.r - c2.r)) {
            return [];
        }

        dx /= d;
        dy /= d;

        const a = (c1.r * c1.r - c2.r * c2.r + d * d) / (2 * d);
        const px = c1.x + a * dx;
        const py = c1.y + a * dy;

        const h = Math.sqrt(c1.r * c1.r - a * a);

        return [
            new Vector2(px + h * dy, py - h * dx),
            new Vector2(px - h * dy, py + h * dx),
        ];
    },
};
Object.freeze(Intersection);
function CartesianToBarycentric(p, a, b, c) {
    let den = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
    let x1 = a.x,
        x2 = b.x,
        x3 = c.x,
        y1 = a.y,
        y2 = b.y,
        y3 = c.y,
        x = p.x,
        y = p.y;
    let w1 = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / den;
    let w2 = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / den;
    let w3 = 1 - w1 - w2;
    return [w1, w2, w3];
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
        let s2 = (-b - disc ** 0.5) / (2 * a);
        return [s1, s2];
    }
    return [];
}
function sqrt(n) {
    return n ** 0.5;
}
function avg(...ns) {
    return ns.reduce((prev, current) => prev + current, 0) / ns.length;
}
function round(n, r = 1) {
    return Math.round(n / r) * r;
}
const mod = {
    pos: function (n, modu = 1) {
        return ((n % modu) + modu) % modu;
    },
    neg: function (n, modu = 1) {
        return ((n % modu) - modu) % modu;
    },
};
const TWO_PI = 2 * Math.PI;
const Angle = {
    angleMode: DEGREES,
    half: 180,
    full: 360,
    degrees: function (rad) {
        return (180 * rad) / PI;
    },
    radians: function (deg) {
        return deg * (PI / 180);
    },
    angleModeToRadians: function (ang) {
        if (this.angleMode == DEGREES) {
            return this.radians(ang);
        } else {
            return ang;
        }
    },
    angleModeToDegrees: function (ang) {
        if (this.angleMode == DEGREES) {
            return ang;
        } else {
            return this.degrees(ang);
        }
    },
    radiansToAngleMode: function (ang) {
        if (this.angleMode == DEGREES) {
            return this.degrees(ang);
        } else {
            return ang;
        }
    },
    degreesToAngleMode: function (ang) {
        if (this.angleMode == DEGREES) {
            return ang;
        } else {
            return this.radians(ang);
        }
    },
    sDistance: function (a, b) {
        a = mod.pos(a, Angle.full);
        b = mod.pos(b, Angle.full);
        let ad = b - a;
        let absad = abs(ad);
        if (absad <= Angle.half) return ad;
        return -(Angle.full - absad) * sign(ad);
    },
    velocity: function (a, b, maxSpeed) {
        if (abs(b - a) < maxSpeed) return b - a;
        return sign(this.sDistance(a, b)) * maxSpeed;
    },
};
function sin(ang) {
    return Math.sin(Angle.angleModeToRadians(ang));
}
function atan2(y, x) {
    return Angle.radiansToAngleMode(Math.atan2(y, x));
}
function cos(ang) {
    return Math.cos(Angle.angleModeToRadians(ang));
}
function AngleMode(mode) {
    Angle.angleMode = mode;
    if (mode == DEGREES) {
        Angle.half = 180;
        Angle.full = 360;
    }
    if (mode == RADIANS) {
        Angle.half = Math.PI;
        Angle.full = Math.PI * 2;
    }
}
function parity(no) {
    return no % 2 == 1 ? 1 : 2;
}
const is = {};
is.odd = function (no) {
    return parity(no) == 1;
};
is.even = function (no) {
    return parity(no) == 2;
};
function lineIntersection(ax, ay, bx, by, cx, cy, dx, dy) {
    //console.log(...arguments);
    let d = (ax - bx) * (cy - dy) - (ay - by) * (cx - dx);

    if (abs(d) < EPSILON / 100) {
        return { intersected: false, parallel: true };
    }
    let u = ((ax - cx) * (ay - by) - (ay - cy) * (ax - bx)) / d; // belongs to x3, x4, y3, y4
    let t = ((ax - cx) * (cy - dy) - (ay - cy) * (cx - dx)) / d; // belongs to x1, x2, y1, y2
    let x = ax + t * (bx - ax);
    let y = ay + t * (by - ay);
    //console.trace(x, y, ...arguments);
    return {
        t: t,
        u: u,
        point: createVector(x, y),
        intersected: t >= 0 && t <= 1 && u >= 0 && u <= 1,
        parallel: false,
    };
}
function lineCast(ox, oy, dx, dy, x3, y3, x4, y4) {
    x1 = ox;
    y1 = oy;
    x2 = ox + dx;
    y2 = oy + dy;
    //console.log(...arguments);
    let d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);


    if (abs(d) < EPSILON / 100) {
        return { intersected: false, parallel: true };
    }

    let u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / d; // belongs to x3, x4, y3, y4
    let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d; // belongs to x1, x2, y1, y2
    if (t >= 0 && u >= 0 && u <= 1) {
        let x = x1 + t * (x2 - x1);
        let y = y1 + t * (y2 - y1);
        //console.trace(x, y, ...arguments);
        return {
            t: t,
            u: u,
            point: createVector(x, y),
            intersected: true,
        };
    } else {
        return {
            t: t,
            u: u,
            intersected: false,
        };
    }
}
function abs(n) {
    return Math.abs(n);
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
            let pt = Vector.add(Vector.setMag(bo, prod), a);
            return {
                point: pt,
                dist: Vector.dist(p, pt),
            };
        },
        line: function (a, b, p) {
            let bo = Vector.sub(b, a);
            let po = Vector.sub(p, a);
            let prod = constraint(Vector.dot(po, bo) / bo.mag(), 0, bo.mag());
            let pt = Vector.add(Vector.setMag(bo, prod), a);
            return {
                point: pt,
                dist: Vector.dist(p, pt),
            };
        },
    },
    line: function (ax, ay, bx, by, px, py) {
        return this.Vector.line(
            new Vector2(ax, ay),
            new Vector2(bx, by),
            new Vector2(px, py)
        );
    },
    rect: function (x, y, rx, ry, rw, rh) {
        if (rw < 0) {
            rw *= -1;
            rx -= rw;
        }
        if (rh < 0) {
            rh *= -1;
            ry -= rh;
        }

        return mag(constraint(x, rx, rx + rw), constraint(y, ry, ry + rh));
    },
    triangle: function () {
        // x, y, x1, y1, x2, y2, x3, y3 arguments needed
        let coll = distance.shape(...arguments);
        return coll;
    },
    circle: function (x, y, x1, y1, r) {
        let A = createVector(x1, y1);
        let B = createVector(x, y);
        let dst = dist(x, y, x1, y1) - r;
        let pt = Vector.add(Vector.sub(A, B).setMag(dst), B);
        return {
            point: pt,
            dist: Math.abs(dst),
        };
    },
    InfiniteLine: function (x1, y1, x2, y2, x3, y3) {
        return this.Vector.Infiniteline(
            createVector(x1, y1),
            createVector(x2, y2),
            createVector(x3, y3)
        );
    },
    shape: function (x, y, ...args) {
        let ps = Vector.fromArray(...args);
        let pt;
        let length = Infinity;
        for (let i = 0; i < ps.length; i++) {
            let ai = i;
            let bi = (i + 1) % ps.length;
            let coll = this.line(ps[ai].x, ps[ai].y, ps[bi].x, ps[bi].y, x, y);
            if (coll.dist < length) {
                length = coll.dist;
                pt = coll.point;
            }
        }
        return {
            dist: length,
            point: pt,
        };
    },
};
Object.freeze(distance);
const collision = {
    RectToRect: function (
        ax,
        ay,
        aw,
        ah,
        avx,
        avy,
        bx,
        by,
        bw,
        bh,
        bvx = 0,
        bvy = 0
    ) {
        let aob = ay + ah;
        let aot = ay;
        let aor = aw + ax;
        let aol = ax;

        let ab = aob + avy;
        let at = aot + avy;
        let ar = aor + avx;
        let al = aol + avx;

        let bot = by;
        let bob = by + bh;
        let bor = bx + bw;
        let bol = bx;

        let bb = bob + bvy;
        let bt = bot + bvy;
        let br = bor + bvx;
        let bl = bol + bvx;

        if (ab < bt || at > bb || al > br || ar < bl)
            return [ax + avx, ay + avy, avx, avy];

        let afx = ax + avx;
        let afy = ay + avy;
        let afvx = avx;
        let afvy = avy;
        //console.log(avx);
        //console.log(afx, afy);
        /* You can only collide with one side at a time, so "else if" is just fine. You don't need to separate the checks for x and y. Only one check can be true, so only one needs to be done. Once it's found, the other's don't need to be done. */
        if (ab >= bt && aob < bot) {
            afy = bt - 0.1 - ah;
            afvy = 0;
        } else if (at <= bb && aot > bob) {
            afy = bb + 0.1;
            afvy = 0; // ... regardless of what side the player collides with
        } else if (ar >= bl && aor < bol) {
            afx = bl - 0.1 - aw;
            afvx = 0;
        } else if (al <= br && aol > bor) {
            afx = br + 0.1;
            afvx = 0;
        }
        let fx = afx;
        let fy = afy;
        //console.log(fx, fy);
        return [fx, fy, afvx, afvy];
    },
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
                pt: pt,
            };
        } else {
            return {
                collided: false,
            };
        }
    },
    circleToCircle: function (x1, y1, x2, y2, r1, r2) {
        let space = r1 + r2;
        let distance = mag(x2 - x1, y2 - y1);
        if (distance < space) {
            let nPos = new Vector2(x1, y1)
                .sub(new Vector2(x2, y2))
                .setMag(space);
            return {
                collided: true,
                position1: new Vector2(x2, y2).add(nPos),
                position2: new Vector2(x1, y1).sub(nPos),
            };
        } else {
            return {
                collided: false,
            };
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
                collided: true,
            };
        }
        return {
            collided: false,
        };
    },
};
const Between = {
    rect: function (px, py, x, y, w, h) {
        return x <= px && y <= py && px <= x + w && py <= y + h;
    },
    circle: function (c, r, p) {
        return Vector.dist(c, p) < r + EPSILON;
    },
};
Object.freeze(Between);
const EPSILON = 0.5;
class RaycastHit {
    constructor(intersected, point, normal) {
        this.hit = intersected;
        this.normal = normal;
        this.point = point;
    }
    length(or) {
        if (this._length ?? false) return this._length;
        if (this.hit) {
            this._length = Vector.dist(or, this.point);
        } else {
            this._length = Infinity;
        }
        return this._length;
    }
    lengthFromXY(x, y) {
        if (this._length ?? false) return this._length;
        if (this.hit) {
            this._length = ((x - this.point.x) ** 2 + (y - this.point.y) ** 2) ** 0.5;
        } else {
            this._length = Infinity;
        }
        return this._length;
    }
    static nearest(o, ...hits) {
        if (hits.length > 0) {
            let currentCast = hits[0];
            //console.log(currentCast);
            let length = currentCast.length(o);
            for (var i = 1; i < hits.length; i++) {
                let len = hits[i].length(o);
                //console.log(currentCast.length(o), len);
                if (hits[i].hit && len < length) {
                    length = len;
                    //console.log(hits[i]);
                    currentCast = hits[i];
                }
            }
            return currentCast;
        }
        return new RaycastHit(false);
    }
}
class RaycastHits extends RaycastHit {
    constructor(hit, array) {
        super(hit.hit, hit.point, hit.normal);
        //console.log(hit);
        this.points = array;
    }
}
function getRectSide(rectData, n) {
    switch (n) {
        case 0:
            return [
                rectData[0],
                rectData[1],
                rectData[0] + rectData[2],
                rectData[1],
            ];
        case 1:
            return [
                rectData[0] + rectData[2],
                rectData[1],
                rectData[0] + rectData[2],
                rectData[1] + rectData[3],
            ];
        case 2:
            return [
                rectData[0] + rectData[2],
                rectData[1] + rectData[3],
                rectData[0],
                rectData[1] + rectData[3],
            ];
        case 3:
            return [
                rectData[0],
                rectData[1] + rectData[3],
                rectData[0],
                rectData[1],
            ];
    }
}
const Raycast = {
    Vector: {
        line: function (rs, r, a, b) {
            return Raycast.line(rs.x, rs.y, r.x, r.y, a.x, a.y, b.x, b.y);
        },
        shape: function (origin, dir, ...verts) {
            return Raycast.shape(
                origin.x,
                origin.y,
                dir.x,
                dir.y,
                ...Vector.array(...verts)
            );
        },
        rect: function (origin, dir, a, bx, by) {
            return Raycast.rect(
                origin.x,
                origin.y,
                dir.x,
                dir.y,
                a.x,
                a.y,
                bx,
                by
            );
        },
        circle: function (o, r, c, rad) {
            return Raycast.circle(o.x, o.y, r.x, r.y, c.x, c.y, rad);
        },
    },
    line: function (rsx, rsy, rx, ry, ax, ay, bx, by,
        rs = createVector(rsx, rsy), a = createVector(ax, ay), b = createVector(bx, by)) { // for optimization they can be calculated once and passed in if needed
        let ln = lineCast(rs.x, rs.y, rx, ry, a.x, a.y, b.x, b.y);
        //console.log(l);
        if (ln.intersected && Vector.dist(rs, ln.point) > EPSILON) {
            return new RaycastHit(true, ln.point, Vector.normal(a, b, rs));
        }
        // if (ln.t >= 0 && ln.t <= 1 && ln.u > 0) {
        //   let pt = Vector.interpolate(a, b, ln.t);
        //   if (Vector.dist(rs, pt) > EPSILON) {
        //     return new RaycastHit(true, pt, Vector.normal(a, b, rs));
        //   }
        // }
        return new RaycastHit(false);
    },
    rect: function (rox, roy, dirX, dirY, ax, ay, aw, ah) {
        return this.shape(
            rox,
            roy,
            dirX,
            dirY,
            ax,
            ay,
            ax + aw,
            ay,
            ax + aw,
            ay + ah,
            ax,
            ay + ah
        );
    },
    rects: function (originX, originY, dirX, dirY, rectDatas) {
        let casts = [];
        let origin = createVector(originX, originY);
        for (let rectData of rectDatas) {
            for (let i = 0; i < 4; i++) {
                let cast = this.line(originX, originY, dirX, dirY, ...getRectSide(rectData, i), origin);
                if (cast.hit) {
                    casts.push(cast);
                }
            }

        }
        return RaycastHit.nearest(origin, ...casts);
    },
    indexedShape: function (originX, originY, dirX, dirY, vertices, indices) {
        //console.log(originX, originY, dirX, dirY);
        let origin = createVector(originX, originY);

        let length = Infinity;
        let finalCast = new RaycastHit(false);
        let hits = [];
        for (var i = 0; i < indices.length; i += 2) {
            let a = indices[i];
            let b = indices[i + 1];
            let cast = this.line(
                originX,
                originY,
                dirX,
                dirY,
                vertices[a * 2],
                vertices[a * 2 + 1],
                vertices[b * 2],
                vertices[b * 2 + 1],
            );
            //console.log(cast.point);
            //console.log(dirX, dirY);
            if (cast.hit) {
                hits.push(cast.point);
                let len = cast.lengthFromXY(originX, originY);
                //console.log(cast.point);
                //let len2 = Vector.dist(Vector.add(origin, dir), cast.point);
                if (len < length /* && len2 < len*/) {
                    length = len;
                    finalCast = cast;
                }
            }
        }
        return new RaycastHits(finalCast, hits);
    },
    circles(originX, originY, dirX, dirY, circleDatas) {
        let finalCast = new RaycastHit(false);
        let hits = [];
        let length = Infinity;
        for (let i = 0; i < circleDatas.length; i++) {
            let cast = this.circle(originX, originY, dirX, dirY, circleDatas[i][0], circleDatas[i][1], circleDatas[i][2]);
            if (cast.hit) {
                hits.push(cast);
                let len = cast.lengthFromXY(originX, originY);
                if (len < length) {
                    length = len;
                    finalCast = cast;
                }

            }
        }
        return new RaycastHits(finalCast, hits);
    },
    shape(originX, originY, dirX, dirY, ...vertices) {
        //console.log(originX, originY, dirX, dirY);

        let length = Infinity;
        let finalCast = new RaycastHit(false);
        let hits = [];
        for (var i = 0; i < vertices.length; i += 2) {
            let a = i;
            let b = (i + 2) % (vertices.length);
            let cast = this.line(
                originX,
                originY,
                dirX,
                dirY,
                vertices[a],
                vertices[a + 1],
                vertices[b],
                vertices[b + 1],
            );
            // console.log(cast.hit);
            //console.log(dirX, dirY);
            if (cast.hit) {
                hits.push(cast.point);
                let len = cast.lengthFromXY(originX, originY);
                //console.log(cast.point);
                //let len2 = Vector.dist(Vector.add(origin, dir), cast.point);
                if (len < length /* && len2 < len*/) {
                    length = len;
                    finalCast = cast;
                }
            }
        }
        //console.log(finalCast);
        return new RaycastHits(finalCast, hits);
    },
    circle(rayOriginX, rayOriginY, rx, ry, cx, cy, circleRadius, n) {
        let relativeRayOriginX = rayOriginX - cx;
        let relativeRayOriginY = rayOriginY - cy;
        let rayLength = mag(rx, ry);
        let circleCenter = new Vector2(cx, cy);
        let a = rx ** 2 + ry ** 2;
        let b = 2 * relativeRayOriginX * rx + 2 * relativeRayOriginY * ry;
        let c = relativeRayOriginX ** 2 + relativeRayOriginY ** 2 - circleRadius ** 2;
        let eq = QuadraticFormula(a, b, c).filter((x) => x * rayLength > EPSILON);

        if (eq.length > 0) {
            let t = min(...eq);

            let relativeX = rx * t;
            let relativeY = ry * t;
            let relativeP = new Vector2(relativeX, relativeY);
            let x = rayOriginX + relativeX;
            let y = rayOriginY + relativeY;
            let p = new Vector2(x, y);
            circle(x, y, 5);

            let hit = new RaycastHit(true, p, Vector.sub(p, circleCenter).normalize());
            hit._length = relativeP.mag();
            if (hit._length > EPSILON);
            return hit;
        }
        return new RaycastHit(false);
    },
};
Object.freeze(Raycast);
function factorize(no) {
    //return [1, no];
    let factors = [1];
    if (no < 0) {
        factors.push(-1);
        no *= -1;
    }
    for (let i = 2; i < no; i++) {
        if (no % i == 0) {
            factors.push(i);
            no /= i;
            i--;
        }
    }
    factors.push(no);
    return factors;
}
{
    let saved = {};
    function factorial(no) {
        no = no - (no % 1);
        return no < 2 ? 1 : saved[no] ?? false ? saved[no] : factorial(no - 1) * no;
    }
}
function floor(no, floore = 1) {
    return no - (no % floore);
}
function getLineEq(ax, ay, bx, by) {
    let a = by - ay;
    let b = ax - bx;
    let hcf = HCF(a, b);
    a /= hcf;
    b /= hcd;
    let c = a * bx + b * by;
    return [a, b, c];
}
function HCF(a, b) {
    while (b != 0) {
        let c = a % b;
        a = b;
        b = c;
    }
    return b;
}
function LCM(a, b) {
    return (a * b) / HCF(a, b);
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
        if (args.length == 1) {
            return Math.random() * args[0];
        } else {
            return Math.random() * (args[1] - args[0]) + args[0];
        }
    },
    rangeInt: function RandomInt() {
        args = arguments;
        if (args.length == 1) {
            return Math.floor(Math.random() * args[0]);
        } else {
            return Math.floor(Math.random() * (args[1] - args[0]) + args[0]);
        }
    },
    element: function (arr) {
        return arr[this.rangeInt(arr.length)];
    },
    choice: function () {
        return arguments[this.rangeInt(arguments.length)];
    },
};
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
        return Math.hypot(b, p);
    },
};
function sign(no) {
    return no < 0 ? -1 : no > 0 ? 1 : 0;
}
function min(...args) {
    return Math.min(...args);
}
function max(...args) {
    return Math.max(...args);
}
function constraint(num, mn, mx) {
    if (mn > mx) {
        [mx, mn] = [mn, mx];
    }
    return min(max(num, mn), mx);
}
function constraintedAxis(num, min, max) {
    return num < min ? -1 : num > max ? 1 : 0;
}
function map(x, mna, mxa, mnb, mxb) {
    return interpolate(mnb, mxb, normalize(x, mna, mxa));
}
function interpolateArray(arr, index) {
    let i = floor(index);
    let ir = index - i;
    let ans = arr[i];
    if (i < arr.length - 2 && ir > 0) {
        ans += (arr[i + 1] - ans) * ir;
    }
    return ans;
}
const Shapes = {
    bounds: function (...pts) {
        let minx = pts[0].x;
        let miny = pts[0].y;
        let maxx = pts[0].x;
        let maxy = pts[0].y;
        for (var i = 0; i < pts.length; i++) {
            minx = min(minx, pts[i].x);
            miny = min(miny, pts[i].y);
            maxx = max(maxx, pts[i].x);
            maxy = max(maxy, pts[i].y);
        }
        return [minx, miny, maxx, maxy];
    },
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
            },
        },
    },
    circle: {
        vertices: {
            get: function (x, y, r, res = 1) {
                let times = this.perimeter(r);
                let o = createVector(x, y);
                let vs = [];
                for (var i = 0; i < times; i += res) {
                    let v = Vector.add(
                        o,
                        Vector.AngleToVector(map(i, 0, times, 0, 360))
                    );
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
            },
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
            },
        },
    },
    rect: {
        vertices: {
            get: function (x, y, w, h) {
                let vs = [
                    createVector(x, y),
                    createVector(x + w, y),
                    createVector(x + w, y + h),
                    createVector(x, y + h),
                ];
                return vs;
            },
            path: function (ax, ay, aw, ah, res = 1) {
                let left = [];
                let right = [];
                let top = [];
                let bottom = [];
                for (var x = 0; x < aw; x += res) {
                    top.push(new Vector2(ax + x, ay));
                    bottom.push(new Vector2(ax + aw - x, ay + ah));
                }
                for (var y = 0; y < ah; y += res) {
                    right.push(new Vector2(ax + aw, ay + y));
                    left.push(new Vector2(ax, ay + ah - y));
                }
                //console.log(top, bottom, right, left);
                return [...top, ...right, ...bottom, ...left];
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
            },
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
            },
        },
    },
    shape: {
        forPixel: function (func, res = 1, ...vs) {
            //console.log(vs);
            let o = splitArray(vs);
            let mny = floor(min(...o.y), res) - res;
            let mxy = floor(max(...o.y), res) + res;

            let smnx = floor(min(...o.x), res) - res;
            let smxx = floor(max(...o.x), res) + res;

            //  console.log(smnx, smxx);
            for (var y = mny; y < mxy; y += res) {
                ///func(smnx, y);
                //func(smxx, y);
                let or = createVector(smnx - 10, y);
                let r = createVector(10, 0);
                let cast = Raycast.Vector.shape(or, r, ...vs);
                //console.log(cast);

                let or1 = createVector(smxx + 10, y);
                let r1 = createVector(-10, 0);
                let cast1 = Raycast.Vector.shape(or1, r1, ...vs);

                if (cast.hit && cast1.hit) {
                    //circle(cast.point.x, cast.point.y, 5);
                    let mnx = floor(cast.point.x, res);
                    let mxx = floor(cast1.point.x, res);
                    // func(mnx, y);
                    // func(mxx, y);
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
            },
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
                let per = this.get(verts);
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
            },
        },
    },
};
// #endregion

// #region Color
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
    if (delta == 0) h = 0;
    // Red is max
    else if (cmax == r) h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g) h = (b - r) / delta + 2;
    // Blue is max
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360�
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return [(h / 360) * 255, (s / 100) * 255, (l / 100) * 255, a];
}
function HSLToRGB(h, s, l, a = 255) {
    h = (h / 255) * 359;
    // Must be fractions of 1
    s /= 255;
    l /= 255;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b, a];
}
function setAlpha(alpha) {
    ctx.globalAlpha = constraint(alpha, 0, 255) / 255;
}
var CANVAS_FILL_MODE_ENABLED = true;
var CANVAS_STROKE_MODE_ENABLED = true;
function brightness(rgb) {
    if (typeof rgb == "object") {
        rgb = rgb.slice(0, 3);
        let mn = min(...rgb);
        let mx = max(...rgb);
        //console.log(mn);
        return avg(mn, mx);
    }
}
function colorMode(mode) {
    Canvas.colorMode = mode;
}
function rgb(...args) {
    //console.log(args);
    if (typeof args[0] == "object" && !(args[0] instanceof Array)) {
        return args[0];
    }
    if (typeof args[0] == "string") {
        return args[0];
    }
    if (args[0] instanceof Array) {
        args = args[0];
    }
    for (var i in args) {
        args[i] = constraint(args[i], 0, 255);
    }
    if (args.length == 1) {
        return `rgba(${args[0]}, ${args[0]}, ${args[0]}, 1)`;
    } else if (args.length == 2) {
        return `rgba(${args[0]}, ${args[0]}, ${args[0]}, ${args[1] / 255})`;
    } else if (args.length == 3) {
        return `rgba(${args[0]}, ${args[1]}, ${args[2]}, 1)`;
    } else if (args.length == 4) {
        return `rgba(${args[0]}, ${args[1]}, ${args[2]}, ${args[3] / 255})`;
    }
}
function invertColor(col) {
    return color(255 - col[0], 255 - col[1], 255 - col[2]);
}
function color() {
    args = filterArray(arguments);
    if (args[0].gradient) {
        return args[0].gradient;
    }
    if (args[0].string) {
        if (args.length > 1) {
            return [args[0].r, args[0].g, args[0].b, args[1]];
        }
        return [args[0].r, args[0].g, args[0].b, args[0].a];
    }
    if (typeof args[0] == "string") {
        return args[0];
    }
    if (Canvas.colorMode == RGB) {
        if (args[0] instanceof Array) {
            return args[0];
        }
        for (var i in args) {
            args[i] = constraint(args[i], 0, 255);
        }
        if (args.length == 1) {
            return [args[0], args[0], args[0], 255];
        } else if (args.length == 2) {
            return [args[0], args[0], args[0], args[1]];
        } else if (args.length == 3) {
            return [args[0], args[1], args[2], 255];
        } else if (args.length == 4) {
            return [args[0], args[1], args[2], args[3]];
        }
    } else if (Canvas.colorMode == HSL) {
        if (args.length == 1) {
            return "hsla(" + (args[0] / 255) * 360 + ", 100%, 50%, 1)";
        } else if (args.length == 2) {
            return (
                "hsla(" +
                (args[0] / 255) * 360 +
                ", 100%, 50%, " +
                args[1] / 255 +
                ")"
            );
        } else if (args.length == 3) {
            return (
                "hsla(" +
                (args[0] / 255) * 360 +
                ", " +
                args[1] / 2.55 +
                "%, " +
                args[2] / 2.55 +
                "%, 1)"
            );
        } else if (args.length == 4) {
            return (
                "hsla(" +
                (args[0] / 255) * 360 +
                ", " +
                args[1] / 2.55 +
                "%, " +
                args[2] / 2.55 +
                "%," +
                args[3] / 255 +
                ")"
            );
        }
    }
}
function HSVtoHSL(h, sv, v, a = 255) {
    sv = sh / 255;
    v = v / 255;
    let l = v * (1 - sv / 2);
    let sl = 0;
    if (!(l == 0) && !(l == 1)) {
        sl = (v - l) / min(l, 1 - l);
    }
    return [h, sl * 255, l * 255, a];
}
const Rgb = {
    add: function (...cols) {
        let arr = [0, 0, 0, 255];
        for (var col of cols) {
            for (let i = 0; i < 3; i++) {
                arr[i] += col[i];
            }
            arr[3] = min(arr[3], col[3]);
        }
        return arr;
    },
    mults: function (col, s) {
        return [col[0] * s, col[1] * s, col[2] * s, col[3]];
    },
    split: function (rgba) {
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
            },
        };
    },
    random: function (...args) {
        if (args.length == 3) {
            return color(Random.rangeInt(args[0]), Random.rangeInt(args[1]), Random.rangeInt(args[2]));
        }
        if (args.length == 6) {
            return color(
                Random.rangeInt(args[0], args[1]),
                Random.rangeInt(args[2], args[3]),
                Random.rangeInt(args[4], args[5])
            );
        }
    },
    weighted: function (...args) {
        let col = [0, 0, 0, 0];
        for (var i = 0; i < args.length; i += 2) {
            col[0] += args[i][0] * args[i + 1];
            col[1] += args[i][1] * args[i + 1];
            col[2] += args[i][2] * args[i + 1];
            col[3] += args[i][3] * args[i + 1];
        }
        return col;
    },
    lerp: function (a, b, t) {
        return a.map((v, i) => v * (1 - t) + b[i] * t);
    }
}
function stroke() {
    var col = color(...arguments);
    if (col instanceof Array) {
        if (Canvas.colorMode == RGB) {
            col = rgb(...col);
        }
    }
    ctx.strokeStyle = col;
    Canvas.strokeStyle = col;
}
function nofill() {
    CANVAS_FILL_MODE_ENABLED = false;
    CANVAS_STROKE_MODE_ENABLED = true;
}
function fill() {
    var col = color(arguments[0], arguments[1], arguments[2], arguments[3]);
    //console.trace();
    if (col instanceof Array) {
        if (Canvas.colorMode == RGB) {
            col = rgb(...col);
        }
    }
    CANVAS_FILL_MODE_ENABLED = true;
    ctx.fillStyle = col;
    Canvas.fillStyle = col;
}
function noStroke() {
    CANVAS_STROKE_MODE_ENABLED = false;
    CANVAS_FILL_MODE_ENABLED = true;
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
    return arr.some((a) => a == item);
}
function includesVector(arr, item) {
    return arr.some((a) => Vector.Equal(a, item));
}
function fillArray(len, ...fls) {
    let arr = new Array(len).map((n, i) => fls[i % fls.length]);
    return arr;
}
class Array2D {
    constructor(width, height, defaultVal = 0) {
        this.array = new Array(width * height);
        let def;
        if (typeof defaultVal != "function") {
            def = () => defaultVal;
        } else {
            def = defaultVal;
        }
        for (var i = 0; i < this.array.length; i++) {
            this.array[i] = def();
        }
        this.resize(width, height);
    }
    getCol(col) {
        let cl = [];
        for (var i = 0; i < this.height; i++) {
            cl.push(this.array[this.index(col, i)]);
        }
        return cl;
    }
    getRow(row) {
        let rw = this.array.slice(this.width * row, this.width * (row + 1));
        return rw;
    }
    set(x, y, val) {
        let ind = this.index(x, y);
        // if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
        //     console.log("Position(" + x + ", " + y + ") out of bounds of 2d array");
        // }
        this.array[ind] = val;
    }
    index(x, y) {
        return y * this.width + x;
    }
    setRow(j, arr) {
        for (var i = 0; i < this.width; i++) {
            this.array[this.index(i, j)] = arr[i];
        }
    }
    setCol(i, arr) {
        for (var j = 0; j < this.height; j++) {
            this.array[this.index(i, j)] = arr[j];
        }
    }
    shuffle() {
        shuffle(this.array);
    }
    pos(ind) {
        let x = ind % this.width;
        let y = (ind - x) / this.width;
        return new Vector2(x, y);
    }
    get(x, y) {
        return this.array[this.index(x, y)];
    }
    getDimensionSize(dimension) {
        return dimension == 0 ? this.width : this.height;
    }
    getDimensionArr(dimension, pos) {
        if (dimension == 0) {
            return this.getCol(pos);
        } else if (dimension == 1) {
            return this.getRow(pos);
        }
    }
    setDimensionArr(dimension, pos, arr) {
        if (dimension == 0) {
            this.setCol(pos, arr);
        } else if (dimension == 1) {
            this.setRow(pos, arr);
        }
    }
    swap(x, y, x1, y1) {
        let ind1 = this.index(x, y);
        let ind2 = this.index(x1, y1);
        [this.array[ind1], this.array[ind2]] = [
            this.array[ind2],
            this.array[ind1],
        ];
    }
    grid() {
        let arr = [];
        for (let x = 0; x < this.width; x++) {
            arr.push([]);
            for (let y = 0; y < this.height; y++) {
                arr[x].push(this.array[this.index(x, y)]);
            }
        }
        return arr;
    }
    forEach(f) {
        this.f = f;
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                let ind = this.index(i, j);
                this.f(i, j, this.array[ind], ind);
            }
        }
    }
    setEach(f) {
        //console.log(this.index);
        this.f = f;
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                let ind = this.index(i, j);
                this.array[ind] = this.f(i, j, ind);
            }
        }

    }
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.array.length = width * height;
    }
    get length() {
        return this.array.length;
    }
}
function shuffle(arr) {
    arr.sort(() => (Math.random() > 0.5 ? 1 : -1));
    return arr;
}
const ArrayMath = {
    number: function (arr1) {
        return arr1.reduce((prev, next) => prev + next, 0);
    },
    mult: (arr1, arr2) => arr1.map((a, i) => a * arr2[i]),
    add: (arr1, arr2) => arr1.map((a, i) => a + arr2[i]),
    sub: (arr1, arr2) => arr1.map((a, i) => a - arr2[i]),
    scalar: {
        mult: (arr, scal) => arr.map((a) => a * scal),
    },
};
function filterArray(arr, val) {
    return [...arr].filter((n) => n != val);
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
    let arr2 = arr.map((a, i) => (a == val ? arr1.push(i) : arr1.length));
    console.log(arr2);
    return arr1;
}
// #endregion

// #region Canvas
class LinearGradient {
    constructor(...args) {
        this.gradient = ctx.createLinearGradient(...args);
    }
    add(t, ...col) {
        this.gradient.addColorStop(t, rgb(color(...col)));
    }
}
class ConicGradient {
    constructor(...args) {
        this.gradient = ctx.createConicGradient(...args);
    }
    add(t, ...col) {
        this.gradient.addColorStop(t, rgb(color(...col)));
    }
}
class RadialGradient {
    constructor(...args) {
        this.gradient = ctx.createRadialGradient(...args);
    }
    add(t, ...col) {
        this.gradient.addColorStop(t, rgb(color(...col)));
    }
}
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const RECTMODE = {
    CORNER: 0,
    CENTER: 1,
};
const Camera2D = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rectMode: RECTMODE.CORNER,
    zoomed: 1,
    convertPos: function (_x, _y) {
        return [this.x + _x * this.scaleX, this.y + _y * this.scaleY];
    },
    invertPos: function (_x, _y) {
        return [(_x - this.x) / this.scaleX, (_y - this.y) / this.scaleY];
    },
    enablePanning() {
        on.update.bind(function () {
            if (mousePressed) {
                Camera2D.translate(Mouse.dx, Mouse.dy);
            }
        });
    },
    getRect: function (_x, _y, _w, _h) {
        [_x, _y] = this.convertPos(_x, _y);
        // if (_w < 0) {
        //     _x += _w;
        //     _w *= -1;
        // }
        // if (_h < 0) {
        //     _y += _h;
        //     _h *= -1;
        // }
        if (this.rectMode == RECTMODE.CENTER) {
            _x -= _w / 2;
            _y -= _h / 2;
        }
        return [_x, _y, _w * this.scaleX, _h * this.scaleY];
    },
    translate: function (dx, dy) {
        this.x += dx;
        this.y += dy;
    },
    zoom: function (zoom, x, y) {
        this.zoomed *= zoom;
        this.x = this.x * zoom + x * (1 - zoom);
        this.y = this.y * zoom + y * (1 - zoom);
        this.scaleX *= zoom;
        this.scaleY *= zoom;
    },
};
const ShapePath = {
    begin: function () {
        ctx.beginPath();
    },
    line: function (ax, ay, bx, by) {
        [ax, ay] = Camera2D.convertPos(ax, ay);
        [bx, by] = Camera2D.convertPos(bx, by);
    },
};
function squircle(x, y, w, h, r) {
    [x, y, w, h] = Camera2D.getRect(x, y, w, h);
    r = min(abs(r * Camera2D.zoomed), w / 2, h / 2);
    ctx.beginPath();
    ctx.arc(x + r, y + r, r, PI, 3 / 2 * PI);
    ctx.arc(x + w - r, y + r, r, -PI / 2, 0);
    ctx.arc(x + w - r, y + h - r, r, 0, PI / 2);
    ctx.arc(x + r, y + h - r, r, PI / 2, PI);
    ctx.closePath();
    if (CANVAS_STROKE_MODE_ENABLED) {
        ctx.stroke();
    }
    if (CANVAS_FILL_MODE_ENABLED) {
        ctx.fill();
    }
}
function rectMode(rctMode) {
    Camera2D.rectMode = rctMode;
}
function downloadCanvasImage(name = "Canvas_Image.png") {
    var link = document.createElement("a");
    link.download = name;
    link.href = ctx.canvas.toDataURL();
    link.click();
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
        sls = CANVAS_STROKE_MODE_ENABLED;
        fls = CANVAS_FILL_MODE_ENABLED;
    }
    function loadColor() {
        if (savedColor && savedColor2) {
            ctx.fillStyle = savedColor;
            ctx.strokeStyle = savedColor2;
            CANVAS_STROKE_MODE_ENABLED = sls;
            CANVAS_FILL_MODE_ENABLED = fls;
        }
    }
    let savedLineCap;
    let savedLineColor;
    let savedStroke;
    function saveLineState() {
        savedLineWidth = ctx.lineWidth;
        savedLineCap = ctx.lineCap;
        savedLineColor = ctx.strokeStyle;
        savedStroke = CANVAS_STROKE_MODE_ENABLED;
    }
    function loadLineState() {
        if (savedLineWidth) {
            ctx.lineWidth = savedLineWidth;
            ctx.lineCap = savedLineCap;
            ctx.strokeStyle = savedLineColor;
            CANVAS_STROKE_MODE_ENABLED = savedStroke;
        }
    }
    class TextMeasure {
        constructor(measure) {
            this.width = measure.width;
            this.height =
                measure.actualBoundingBoxDescent +
                measure.actualBoundingBoxAscent;
            this.offset = new Vector2(
                measure.actualBoundingBoxLeft,
                measure.actualBoundingBoxAscent
            );
        }
    }
    function measureText(text_str) {
        let measure = ctx.measureText(text_str);
        //console.log(measure)
        return new TextMeasure(measure);
    }
}
const OPEN = 0;
const CLOSE = 1;
{
    let vertices = [];
    let begun = true;
    function vertex(x, y) {
        [x, y] = Camera2D.convertPos(x, y);
        vertices.push(x, y);
    }
    function beginShape() {
        vertices = [];
    }
    function endShape(close = CLOSE) {
        ctx.beginPath();
        ctx.moveTo(vertices[0], vertices[1]);
        for (var i = 2; i < vertices.length; i += 2) {
            ctx.lineTo(vertices[i], vertices[i + 1]);
        }
        if (close == CLOSE) {
            //console.log(close);
            ctx.lineTo(vertices[0], vertices[1]);
            ctx.closePath();
        }
        if (CANVAS_FILL_MODE_ENABLED && close == CLOSE) {
            ctx.fill();
        }
        if (CANVAS_STROKE_MODE_ENABLED) {
            ctx.stroke();
        }
        vertices = [];
    }
}
function setPixel(x, y, col) {
    [x, y] = Camera2D.convertPos(x, y);
    let c = ctx.fillStyle;
    ctx.fillStyle = col;
    ctx.fillRect(x, y, 1, 1);
    ctx.fillStyle = c;
}
function triangle(x, y, x1, y1, x2, y2) {
    [x, y] = Camera2D.convertPos(x, y);
    [x1, y1] = Camera2D.convertPos(x1, y1);
    [x2, y2] = Camera2D.convertPos(x2, y2);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x, y);
    ctx.closePath();
    if (CANVAS_FILL_MODE_ENABLED) {
        ctx.fill();
    }
    if (CANVAS_STROKE_MODE_ENABLED) {
        ctx.stroke();
    }
}
function circle(x, y, r, arca = 0, arcb = 360) {
    [x, y] = Camera2D.convertPos(x, y);
    ctx.beginPath();
    r = max(r, 0);
    ctx.arc(
        x,
        y,
        r * Camera2D.zoomed,
        Angle.angleModeToRadians(arca),
        Angle.angleModeToRadians(arcb)
    );
    ctx.closePath();
    if (CANVAS_FILL_MODE_ENABLED) {
        ctx.fill();
    }
    if (CANVAS_STROKE_MODE_ENABLED) {
        ctx.stroke();
    }
}
function ellipse(x, y, a, b, arca = 0, arcb = 360) {
    [x, y] = Camera2D.convertPos(x, y);
    var c = ctx.strokeStyle;
    //ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.ellipse(
        x,
        y,
        a,
        b,
        0,
        Angle.angleModeToRadians(arca),
        Angle.angleModeToRadians(arcb)
    );
    ctx.closePath();
    if (CANVAS_FILL_MODE_ENABLED) {
        ctx.fill();
    }
    if (CANVAS_STROKE_MODE_ENABLED) {
        ctx.stroke();
    }
}
function point(x, y) {
    [x, y] = Camera2D.convertPos(x, y);
    circle(x, y, ctx.lineWidth / 2);
}
function rect(x, y, w, h, rotat) {
    [x, y, w, h] = Camera2D.getRect(x, y, w, h);
    if (CANVAS_FILL_MODE_ENABLED) {
        ctx.fillRect(x, y, w, h);
    }
    if (CANVAS_STROKE_MODE_ENABLED) {
        ctx.beginPath();
        ctx.strokeRect(x, y, w, h);
        ctx.closePath();
    }
}
// const video = document.createElement("video");
// video.controls = true;
// document.body.appendChild(video);
const Canvas = {
    textFontFamily: "Verdana",
    textFontSize: 10,
    lineWidth: undefined,
    lineCap: "butt",
    strokeStyle: undefined,
    fillStyle: undefined,
    colorMode: RGB,
    enabled: false,
    recording: false,
    recordingFrames: false,
    mediaRecorder: null,
    chunks: [],
    setRecordingStartStop: function (start, stop, filename = "download") {
        this.setRecordingStart(start);
        this.setRecordingStop(stop, filename);
    },
    setRecordingStart(key) {
        addHotKey(key, function () {
            Canvas.startRecording();
        });
    },
    setRecordingStop(key, filename = "download") {
        addHotKey(key, function () {
            Canvas.stopRecording(filename);
        });
    },
    startRecording: function () {
        var videoStream = this.canvas.captureStream(30);
        this.mediaRecorder = new MediaRecorder(videoStream);
        this.mediaRecorder.ondataavailable = function (e) {
            //console.log(e);
            Canvas.chunks.push(e.data);
        };
        this.mediaRecorder.start();
        this.recording = true;

    },
    stopRecording: function (filename = "download") {
        if (!this.recording) return;
        this.mediaRecorder.onstop = function (e) {
            var blob = new Blob(Canvas.chunks, { 'type': 'video/mp4' });
            var videoURL = URL.createObjectURL(blob);
            Canvas.chunks = [];
            let a = document.createElement("a");
            a.download = filename;
            a.href = videoURL;

            a.click();
            //video.play();
        };
        this.mediaRecorder.stop();
        this.recording = false;

    },
    recordingFrames: false,
    autoRecordingFrames: false,
    startRecordingFrames: function (auto) {
        if (!this.recordingFrames) {
            this.recordingFrames = true;
            this.autoRecordingFrames = auto;
            var videoStream = this.canvas.captureStream(30);
            this.mediaRecorder = new MediaRecorder(videoStream);

            this.mediaRecorder.ondataavailable = function (e) {
                console.log(e.data);
                Canvas.chunks.push(e.data);
                console.log("doing");
            };
            console.log("done");
            this.mediaRecorder.start();
        }
    },
    recordFrame: function () {
        if (this.recordingFrames) {

        }
    },
    stopRecordingFrames: function (filename = "download") {
        if (this.recordingFrames) {
            this.recordingFrames = false;
            this.mediaRecorder.onstop = function (e) {
                var blob = new Blob(Canvas.chunks, { 'type': 'video/mp4' });
                var videoURL = URL.createObjectURL(blob);
                Canvas.chunks = [];
                downloadFromURL(videoURL, filename);
                //video.play();
            };
            this.mediaRecorder.stop();
        }
    },
    record(seconds, filename = "download") {
        this.startRecording();
        setTimeout(function () { Canvas.stopRecording(filename); }, seconds);
    },
    recordFrames(seconds, filename = "download") {
        this.startRecording();
        setTimeout(function () { Canvas.stopRecording(); }, seconds);
    }
};
var ctx,
    CanvasWidth,
    CanvasHeight,
    CanvasColor,
    mouseOverCanvas,
    CanvasOffset,
    mousePressed = false;
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
function textFont(font) {
    Canvas.textFontFamily = font;
    ctx.font = Canvas.textFontSize + "px " + font;
}
function textSize(size) {
    ctx.font = size + "px " + Canvas.textFontFamily;
    Canvas.textFontSize = size;
}
function text(txt, x, y) {
    [x, y] = Camera2D.convertPos(x, y);
    if (CANVAS_STROKE_MODE_ENABLED) {
        ctx.strokeText(txt, x, y);
    }
    if (CANVAS_FILL_MODE_ENABLED) {
        ctx.fillText(txt, x, y);
    }
}
var scaled = new Vector2(1, 1);
function scale(x, y = x) {
    ctx.scale(x, y);
    scaled.x *= x;
    scaled.y *= y;
}
function lineWidth(w = ctx.lineWidth) {
    ctx.lineWidth = w;
    Canvas.lineWidth = w;
    return w;
}
function createCanvas(
    w = windowWidth,
    h = windowHeight,
) {
    var canvas = document.createElement("canvas");
    w = min(windowWidth, w);
    h = min(windowHeight, h);
    // if (IsMobile()) {
    //     let ratio = w / h;
    //     w = innerWidth;
    //     h = ratio * w;
    // }
    canvas.width = w;
    canvas.height = h;
    CanvasWidth = w;
    CanvasHeight = h;
    Canvas.enabled = true;
    document.body.insertBefore(canvas, document.body.childNodes[0]);
    ctx = canvas.getContext("2d");
    Draw.ctx = ctx;
    ctx.imageSmoothingEnabled = false;
    Canvas.lineWidth = ctx.lineWidth;
    Canvas.fillStyle = ctx.fillStyle;
    Canvas.strokeStyle = ctx.strokeStyle;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = Canvas.textFontSize + "px " + Canvas.textFontFamily;

    Canvas.canvas = canvas;

    return canvas;
}
function clear(x = 0, y = 0, w = CanvasWidth, h = CanvasHeight) {
    let t = ctx.getTransform();
    ctx.resetTransform();
    ctx.clearRect(x, y, w, h);
    ctx.setTransform(t);
}
function backGround(...col) {
    push();
    ctx.resetTransform();
    saveColor();
    fill(...col);
    ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);
    loadColor();
    pop();
}
function line(x, y, x1, y1) {
    [x, y] = Camera2D.convertPos(x, y);
    [x1, y1] = Camera2D.convertPos(x1, y1);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
}
function rotate(deg) {
    ctx.rotate(Angle.angleModeToRadians(deg));
}
function translate(x, y) {
    ctx.translate(x, y);
}
{
    const savedTransforms = [];
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
        val = (1 / val) * window.devicePixelRatio;
        var c = ctx.canvas;
        var w = c.width,
            h = c.height;
        c.setAttribute("width", w * val);
        c.setAttribute("height", h * val);
        //console.log(w);
        c.style.width = w + "px";
        c.style.height = h + "px";
        ctx.scale(val, val);
        backGround(255);
    } else {
        return densityVal;
    }
}
// #endregion

// #region Draw
const Draw = {
    ctx: undefined,
    Polygon(vertices, close) {
        ctx.beginPath();
        ctx.moveTo(vertices[0], vertices[1]);
        for (var i = 2; i < vertices.length; i += 2) {
            ctx.lineTo(vertices[i], vertices[i + 1]);
        }
        if (close == CLOSE) {
            //console.log(close);
            ctx.lineTo(vertices[0], vertices[1]);
            ctx.closePath();
        }
        if (CANVAS_FILL_MODE_ENABLED && close == CLOSE) {
            ctx.fill();
        }
        if (CANVAS_STROKE_MODE_ENABLED) {
            ctx.stroke();
        }
    },
    IndexedLines(verticesArrayXY, indices, fill = false) {
        this.ctx.beginPath();
        for (var i = 0; i < indices.length; i += 2) {
            let ai = indices[i];
            let bi = indices[i + 1];
            if (i > 0 && ai == indices[i - 1]) {
                this.ctx.lineTo(verticesArrayXY[ai * 2], verticesArrayXY[ai * 2 + 1]);
                //console.log(ai, indices[i - 1]);
                continue;
            }
            this.ctx.moveTo(verticesArrayXY[ai * 2], verticesArrayXY[ai * 2 + 1]);
            this.ctx.lineTo(verticesArrayXY[bi * 2], verticesArrayXY[bi * 2 + 1]);
        }
        this.ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        ctx.stroke();
    },
    Circle: function (...args) { // x, y, r, startAngle?, endAngle?
        circle(...args);
    },
    Circles(circleDataArray) {
        for (let circleData of circleDataArray) {
            this.Circle(...circleData);
        }
    },
    Rect(x, y, w, h) {
        rect(x, y, w, h);
    },
    Rects(rectDatas) {
        for (let rectData of rectDatas) {
            this.Rect(...rectData);
        }
    }
}
// #endregion

// #region HTML
{
    function createVector2SLider(
        mnx,
        mxx,
        mny,
        mxy,
        step = 1,
        valx = (mnx + mxx) / 2,
        valy = (mny + mxy) / 2,
        n = ""
    ) {
        return new Vector2Slider(mnx, mxx, mny, mxy, step, valx, valy, n);
    }
    function createVector3SLider(
        mnx,
        mxx,
        mny,
        mxy,
        mnz,
        mxz,
        step = 1,
        valx = (mnx + mxx) / 2,
        valy = (mny + mxy) / 2,
        valz = (mnz + mxz) / 2,
        n = ""
    ) {
        return new Vector3Slider(
            mnx,
            mxx,
            mny,
            mxy,
            mnz,
            mxz,
            step,
            valx,
            valy,
            valz,
            n
        );
    }
    class Vector2Slider {
        constructor(
            mnx,
            mxx,
            mny,
            mxy,
            step = 1,
            valx = (mnx + mxx) / 2,
            valy = (mny + mxy) / 2,
            n = ""
        ) {
            if (n != "") {
                n += " ";
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
        constructor(
            mnx,
            mxx,
            mny,
            mxy,
            mnz,
            mxz,
            step = 1,
            valx = (mnx + mxx) / 2,
            valy = (mny + mxy) / 2,
            valz = (mnz + mxz) / 2,
            n = ""
        ) {
            if (n != "") {
                n += " ";
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
        };
        this.addClass = function (cl) {
            this.element.classList.add(cl);
        };
        this.text = function (tex) {
            this.element.innerHTML = tex;
        };
        document.body.appendChild(this.element);
        this.element.style.position = "absolute";
        this.update = function () {
            this.element.style.top = this.y + CanvasOffset.y;
            this.element.style.left = this.x + CanvasOffset.x;
            this.element.style.width = this.width;
            this.element.style.height = this.height;
            this.element.style.color = this.color;
            this.element.style.backgroundColor = this.color;
        };
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
    function createSlider(
        min,
        max,
        step = 1,
        val = (min + max) / 2,
        name,
        par = document.body
    ) {
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
            this.value = this.value.replace(/[^0-9.]/g, "");
        };
        input.onchange = function () {
            slider.value = this.value;
            this.value = slider.value;
        };
        input.classList.add("sliderText");
        slider.oninput = function () {
            input.value = this.value;
        };
        div.classList.add("sliderCont");
        div.appendChild(slider);
        div.appendChild(input);
        //console.log(slider.value);
        let cls = new HTMLSlider(slider, input, div);
        //console.log(slider.value);
        return cls;
    }
    class HTMLSlider {
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
var pixels = [];
class CImage {
    static canvas = document.createElement("canvas");
    static ctx = CImage.canvas.getContext("2d");
    constructor(im) {
        this.width = im.width;
        this.height = im.height;
        this.image = im;
    }
    loadPixels() {
        this.pixels = [];
        CImage.canvas.width = this.width;
        CImage.canvas.height = this.height;
        CImage.ctx.drawImage(this.image, 0, 0);
        this.data = CImage.ctx.getImageData(0, 0, this.width, this.height);
        for (var i = 0; i < this.data.data.length; i += 4) {
            let col = [...this.data.data.slice(i, i + 4)];
            if (Canvas.colorMode == HSL) {
                //col = [...RGBToHSL(...col)];
            }
            this.pixels.push(col);
        }
    }
    forPixel(f) {
        this.loadPixels();
        for (var i = 0; i < this.pixels.length; i++) {
            let p = this.pos(i);
            this.pixels[i] = f(p.x, p.y, i);
        }
        this.updatePixels();
    }
    filter(f) {
        this.loadPixels();
        for (var i = 0; i < this.pixels.length; i++) {
            let p = this.pos(i);
            this.pixels[i] = f(this.pixels[i], p.x, p.y);
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
        CImage.canvas.width = this.width;
        CImage.canvas.height = this.height;
        CImage.ctx.putImageData(this.data, 0, 0);
        this.image.src = CImage.ctx.canvas.toDataURL();
        //console.log(this.image);
    }
    download(name) {
        this.updatePixels();
        var link = document.createElement("a");
        link.download = name;
        link.href = this.image.src;
        link.click();
    }
    onload(func) {
        var ths = this;
        this.image.onload = function () {
            ths.image.onload = function () { };
            func(ths);
        };
    }
}
{
    function resize(width, height) {
        ctx.canvas.width = width;
        ctx.canvas.height = height;
    }
    function loadPixels() {
        let data = ctx.getImageData(0, 0, CanvasWidth, CanvasHeight);
        Canvas.data = data;
        setArray(Canvas.data.data, pixels);
        // for (var i = 0; i < data.data.length; i += 4) {
        //     let arr = data.data.slice(i, i + 4);
        //     //console.log(...arr);
        //     if (Canvas.colorMode == HSL) {
        //         arr = RGBToHSL(...arr);
        //     }
        //     //console.log(arr);
        //     pixels.push([...arr]);
        // }
    }
    function updatePixels() {
        // setArray(Canvas.data, joinArrays(pixels));
        // let pixs = [];
        // for (var i = 0; i < pixels.length; i++) {
        //     let arr = pixels[i];
        //     if (Canvas.colorMode == HSL) {
        //         arr = HSLToRGB(...arr);
        //     }
        //     pixs.push(...arr);
        // }
        setArray(Canvas.data.data, pixels);
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
        CImage.canvas.width = w;
        CImage.canvas.height = h;
        let img = new Image(w, h);
        CImage.ctx.fillStyle = color(0, 0, 0, 0);
        CImage.ctx.fillRect(0, 0, w, h);
        img.src = CImage.ctx.canvas.toDataURL();
        let im = new CImage(img);
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
        Sketch.LOADING++;
        var myImage = new Image();
        myImage.src = name;
        let im = new CImage(myImage);
        if (width && height) {
            myImage.width = width;
            myImage.height = height;
        }
        myImage.onload = function () {
            myImage.onload = () => { };
            im.width = myImage.width;
            im.height = myImage.height;
            if (cb) {
                cb(im);
            } else if (!height && width) {
                width(im);
            }
            Sketch.LOADING--;
            Sketch.tryStart();
        };
        return im;
    }
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

//#region UI
on.pointerdown.bind(function (button, x, y, event) {
    for (var i = UI.Elements.length - 1; i >= 0; i--) {
        let element = UI.Elements[i];
        if (element.getHoveredInfo() && element.enabled) {
            UI.Click(element);
            //mousePressed = false;
            return EVENT_PREVENT_DEFAULT;
        }
    }
});
on.pointerup.bind(function (x, y, dx, dy, event) {
    return UI.UnClick();
});
class UIElement {
    static Selected = false;
    localPosition;
    id;
    #_layer = 0;

    enabled = true;
    drawing = true;
    updating = true;

    outlined = false;
    outlineCol = color(0);

    baseColor;
    color = color(0, 255, 0);

    size;
    shape;

    clicked = false;
    hovered = false;

    constructor(x, y, ...shapeArgs) {
        this.offset = createVector();
        this.position = createVector(x, y);
        this.id = UI.Elements.length;
        this.onclick = new EventHandler();
        UI.Elements.push(this);
        UI.Relayer();
        //console.log(shapeArgs);
        this.setShape(...shapeArgs);

        if (Sketch.STARTED) {
            this.a = new Vector2(0, 0);
            this.b = new Vector2(CanvasWidth, CanvasHeight);
        }
    }
    get position() {
        return this.localPosition;
    }
    get x() {
        return this.position.x;
    }
    get y() {
        return this.position.y;
    }
    lx(lx) {
        if (lx) {
            this.localPosition.x = lx;
        }
        return this.localPosition.x;
    }
    ly(ly) {
        if (ly) {
            this.localPosition.y = ly;
        }
        return this.localPosition.y;
    }
    set position(val) {
        this.localPosition = val;
    }
    set layer(layer) {
        this.#_layer = layer;
        UI.Relayer();
    }
    get layer() {
        return this.#_layer;
    }
    Disable() {
        this.enabled = false;
    }
    updateUI() {
        this.color = this.baseColor;
        this.getHoveredInfo();
        this.update();
    }
    update() { }
    drawUI() {
        saveColor();
        fill(this.color);
        if (this.outlined) {
            stroke(this.outlineCol);
        } else {
            noStroke();
        }
        this.draw();
        loadColor();
    }
    Enable() {
        this.enabled = true;
    }
    Destroy() {
        UI.Elements.splice(this.id, 1);
        UI.Reorder();
        delete this;
    }
    getMouse() {
        return mouse.copy();
    }
    setShape(shape, ...sizes) {
        //console.log(sizes);
        if (shape == UI.SQUARE) {
            this.offset = createVector(-sizes[0] / 2, -sizes[0] / 2);
            shape = UI.RECT;
            sizes = [sizes[0], sizes[0]];
        } else if (shape == UI.RECT) {
            this.offset = createVector(-sizes[0] / 2, -sizes[1] / 2);
            //sizes = [sizes[0], sizes[1]];
        } else if (shape == UI.CIRCLE) {
            this.offset = createVector(0, 0);
            sizes = [sizes[0], sizes[0]];
        }
        this.shape = shape;
        this.size = sizes;
    }
    draw() {
        let position = this.position;
        if (this.shape == UI.CIRCLE) {
            circle(
                position.x + this.offset.x,
                position.y + this.offset.y,
                this.size[0]
            );
        } else if (this.shape == UI.RECT) {
            rect(
                position.x + this.offset.x,
                position.y + this.offset.y,
                this.size[0],
                this.size[1]
            );
        }
        let textt = "" + this._text(this);
        //console.log(textt);
        if (textt.length > 0) {
            ctx.save();
            fill(this._textcolor(this.color));
            textSize(this._textSize);
            text(textt, position.x, position.y);
            ctx.restore();
        }
    }
    text(text, size, col = color(0)) {
        if (typeof text == "function") {
            this._text = text;
        } else {
            this._text = () => text;
        }
        this._textSize = size;
        if (typeof col != "function") {
            this._textcolor = () => col;
        } else {
            this._textcolor = col;
        }
    }
    _text() {
        return "";
    }
    _textSize;
    _textcolor;
    getHoveredInfo() {
        this.hovered = this.calcHoveredInfo();
        return this.hovered;
    }
    calcHoveredInfo() {
        let mouse1 = mouse.copy();
        let position = this.position;
        if (this.shape == UI.CIRCLE) {
            return (
                Vector.dist(Vector.add(position, this.offset), mouse1) <=
                this.size[0]
            );
        } else if (this.shape == UI.RECT) {
            let vec = Vector.add(position, this.offset);
            return Between.rect(
                mouse1.x,
                mouse1.y,
                vec.x,
                vec.y,
                this.size[0],
                this.size[1]
            );
        }
        return false;
    }
    bind(type, func, ...args) {
        if (type == "click") {
            this.onclick.bind(func, [this, ...args]);
        }
    }
}
class Button extends UIElement {
    hoveredColor;
    clickedColor;

    constructor(x, y, w, h, col = color(0, 255, 0)) {
        super(x, y, UI.RECT, w, h);
        this.setColor(col);
    }
    setColor(col) {
        this.baseColor = col;
        this.hoveredColor = col.map((a, i) => (i == 3 ? a : a * 0.85));
        this.clickedColor = col.map((a, i) => (i == 3 ? a : a * 0.7));
    }
    drawUI() {
        this.color = this.baseColor;
        if (this.clicked) {
            this.color = this.clickedColor;
        } else if (this.hovered) {
            this.color = this.hoveredColor;
        }
        super.drawUI();
    }
}
class Gizmo extends UIElement {
    static DEFAULTRADIUS = 10;
    static Selected = false;

    parent;
    mouseOffset;
    lastPosition;
    children = [];

    setColor(col) {
        this.baseColor = col;
        this.hoveredColor = col.map((a, i) => (i == 3 ? a : a * 0.85));
        this.clickedColor = col.map((a, i) => (i == 3 ? a : a * 0.7));
    }
    setParent(par, keepOffset = true) {
        par.children.push(this);
        this.parent = par;
        //console.log(this.localPosition);
        if (keepOffset) {
            this.localPosition.sub(this.parent.position);
        }
    }
    setChild(child) {
        child.setParent(this);
    }
    pair(pair, type, func) {
        this.bind(type, func, pair);
        pair.bind(type, func, this);
    }
    constructor(x, y, col = color(0, 255, 0)) {
        super(x, y, UI.CIRCLE, Gizmo.DEFAULTRADIUS);
        //console.log(x, y);
        this.setColor(col);
        this.mouseOffset = new Vector2(0, 0);
        this.onmove = new EventHandler();

        this.onclick.bind(
            function (gizmo) {
                gizmo.mouseOffset = Vector.sub(
                    gizmo.getMouse(),
                    gizmo.localPosition
                );
                Gizmo.Selected = gizmo;
            },
            [this]
        );
    }
    get position() {
        return Vector.add(this.localPosition, this.parentPosition);
    }
    set position(pos) {
        this.localPosition = Vector.sub(pos, this.parentPosition);
    }
    get parentPosition() {
        if (this.parent) {
            return this.parent.position;
        } else {
            return createVector(0, 0);
        }
    }
    getMouse() {
        let par = this.parentPosition;
        return Vector.sub(mouse, par);
    }
    bind(type, func, ...args) {
        super.bind(type, func, ...args);
        if (type == "move") {
            this.onmove.bind(func, [this, ...args]);
        }
    }
    update() {
        super.update();
        let lastPosition = this.localPosition;
        if (this.clicked) {
            let npos = Vector.sub(this.getMouse(), this.mouseOffset);
            //console.log(npos);
            this.localPosition = npos;
            if (this.parent) {
                this.position = Vector.constraint(
                    this.position,
                    this.a,
                    this.b
                );
            }
            this.color = this.clickedColor;
        } else if (this.hovered) {
            this.color = this.hoveredColor;
        }
        if (!this.parent) {
            this.localPosition = Vector.constraint(
                this.localPosition,
                this.a,
                this.b
            );
        }
        if (!Vector.Equal(lastPosition, this.localPosition)) {
            let dt = Vector.sub(this.localPosition, lastPosition);
            this.onmove.Fire(dt);
        }
        return this;
    }
    get px() {
        return this.localPosition.x;
    }
    get py() {
        return this.localPosition.y;
    }
}
class CheckBox extends UIElement {
    checked = false;

    hoveredColor;
    hoveredAndCheckedColor;
    normalColor;
    checkedColor;

    constructor(x, y, col = color(0, 255, 0)) {
        super(x, y, UI.CIRCLE, 10);
        this.setColor(col);
        this.onclick.bind(
            function (gizmo) {
                gizmo.checked = !gizmo.checked;
            },
            [this]
        );
    }
    setColor(col) {
        this.baseColor = col;
        this.hoveredColor = col.map((a, i) => (i == 3 ? a : a * 0.85));
        this.hoveredAndCheckedColor = col.map((a, i) =>
            i == 3 ? a : a * 0.85
        );
        this.checkedColor = col.map((a, i) => (i == 3 ? a : a * 0.7));
    }
    setNormalColor(col) {
        this.baseColor = col;
        this.hoveredColor = col.map((a, i) => (i == 3 ? a : a * 0.85));
    }
    setCheckedColor(col) {
        this.checkedColor = col;
        this.hoveredAndCheckedColor = col.map((a, i) =>
            i == 3 ? a : a * 0.85
        );
    }
    OnClick() {
        this.checked = !this.checked;
    }
    update() {
        super.update();
        if (this.checked && this.hovered) {
            this.color = this.hoveredAndCheckedColor;
        } else if (this.checked) {
            this.color = this.checkedColor;
        } else if (this.hovered) {
            this.color = this.hoveredColor;
        }
    }
}
class Slider extends UIElement {
    lineWidth;
    lineColor = color(200);
    constructor(
        ax,
        ay,
        bx,
        by,
        min,
        max,
        value = (min + max) / 2,
        col = color(0, 255, 0)
    ) {
        super(
            normalize(value, min, max) * (bx - ax) + ax,
            normalize(value, min, max) * (by - ay) + ay,
            UI.CIRCLE,
            UI.DEFAULT_RADIUS
        );
        this.max = max;
        this.min = min;
        this.a = new Vector2(ax, ay);
        this.b = new Vector2(bx, by);
        this.len = Vector.dist(this.a, this.b);
        this.lineWidth = 5;
        this.setColor(col);
        //console.log(normalize(value, ));
        this.change = new EventHandler();
    }
    setColor(col2) {
        this.baseColor = col2;
        this.hoveredColor = col2.map((a, i) => (i == 3 ? a : a * 0.85));
        this.clickedColor = col2.map((a, i) => (i == 3 ? a : a * 0.7));
    }
    name(name, size, offsetx, offsety) {
        this.nameoffsetx = offsetx;
        this.nameoffsety = offsety;
        if (typeof name == "function") {
            this._name = name;
        } else {
            this._name = () => name;
        }
        this.nameSize = size;
    }
    _name;
    update() {
        super.update();
        if (this.clicked) {
            let lastposition = this.localPosition;
            this.localPosition = distance.line(
                this.a.x,
                this.a.y,
                this.b.x,
                this.b.y,
                mouse.x,
                mouse.y
            ).point;
            if (!Vector.Equal(this.localPosition, lastposition)) {
                this.change.Fire();
            }
        }
        if (this.clicked && this.hovered) {
            this.color = this.clickedColor;
        } else if (this.hovered || this.clicked) {
            //console.log("hovered");
            this.color = this.hoveredColor;
        }
    }
    value(accuracy = 1000) {
        let num = Vector.dist(this.localPosition, this.a);
        return (
            Math.round(
                (this.min + (this.max - this.min) * (num / this.len)) * accuracy
            ) / accuracy
        );
    }
    bind(type, func) {
        super.bind(type, func);
        if (type == "change") {
            this.change.bind(func);
        }
    }
    draw() {
        saveLineState();
        if (this.shape == UI.CIRCLE) {
            lineCap("round");
        } else {
            lineCap("square");
        }
        lineWidth(this.lineWidth * 2);
        stroke(this.lineColor);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
        loadLineState();

        noStroke();
        textAlign('center', 'middle');

        super.draw();
        //console.log(name);
        if (this._name) {
            const name = "" + this._name(this);
            ctx.save();
            fill(0);
            textSize(this.nameSize);
            textAlign('center', 'middle');
            text(
                name,
                this.a.x + this.nameoffsetx,
                this.a.y + this.nameoffsety
            );
            //console.log(name, this.a.x + this.nameoffsetx, this.a.y + this.nameoffsety);
            ctx.restore();
        }
    }
}
const UI = {
    Elements: [],
    DEFAULT_RADIUS: 10,
    Relayer: function () {
        this.Elements.sort((a, b) => a.layer - b.layer);
        this.Reorder();
    },
    Reorder: function () {
        for (var i = 0; i < this.Elements.length; i++) {
            this.Elements[i].id = i;
        }
    },
    Click(element) {
        element.clicked = true;
        UIElement.Selected = element;
        element.onclick.Fire(element);
    },
    UnClick(element) {
        if (UIElement.Selected) {
            UIElement.Selected.clicked = false;
            UIElement.Selected = false;
            Gizmo.Selected = false;
            return EVENT_PREVENT_DEFAULT;
        }
    },
    Draw: function () {
        for (var i = 0; i < this.Elements.length; i++) {
            let element = this.Elements[this.Elements.length - i - 1];
            if (element.drawing && element.enabled) {
                element.drawUI();
            }
        }
    },
    Update: function () {
        for (var i = this.Elements.length - 1; i >= 0; i--) {
            let element = this.Elements[i];
            if (element.updating && element.enabled) {
                element.updateUI();
            }
        }
    },
    Clear() {
        for (var i = 0; i < this.Elements.length; i++) {
            delete this.Elements[i];
        }
        this.Elements.length = 0;
    },
    Enable() {
        this.enabled = true;
    },
    Disable() {
        this.enabled = false;
    },
    set enabled(val) {
        for (let elem of this.Elements) {
            elem.enabled = val;
        }
    },
    Selected: false,
    CIRCLE: 0,
    SQUARE: 1,
    RECT: 2,
};
//Object.freeze(UI);
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
        },
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
        let mat = new Matrix(2, 2, [cos(ang), -sin(ang), sin(ang), cos(ang)]);
        return mat;
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
        let mat2 = ArrayMath.scalar.mult(
            this.adjoint2(mat),
            1 / this.det2(mat)
        );
        //console.log(mat2);
        return mat2;
    },
    lookAt: function (up, forward, pos) {
        up.normalize();
        forward.normalize();
        let x = Vector3D.crossProduct(up, forward);
        x.normalize();
        return new Matrix(4, 4, [
            x.x,
            up.x,
            forward.x,
            0,
            x.y,
            up.y,
            forward.y,
            0,
            x.z,
            up.z,
            forward.z,
            0,
            0,
            0,
            0,
            1,
        ]);
    },
    transform3: function (t, s, r) {
        let rot = this.rotation3(r.x, r.y, r.z);
        let trans = this.translate3(t.x, t.y, t.z);
        //console.log(trans.grid());
        let scaling = this.getScaling3(s.x, s.y, s.z);
        let mat = this.mult(scaling, rot, trans);
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
    },
};
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
};
var m22;
// #endregion
