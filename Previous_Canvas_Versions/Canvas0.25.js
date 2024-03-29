
var colliders = [];
var ctx, CanvasWidth, CanvasHeight, CanvasColor, mouseOverCanvas, drawEnabled, floor, CanvasOffset;
var fl = true;
var PI = Math.PI;
var drawEnabled = false;
var translated = new Vector(0, 0);
var angle = 0;
var space = " ";
var frameNo = 0;
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
function AngleToVector(ang, rad) {
    let x = rad * Math.cos(radians(ang));
    let y = rad * Math.sin(radians(ang));
    return new Vector(x, y);
}
function radians(deg) {
    return deg * PI / 180;
}
document.onmousemove = handleMouseMove;
var mousePosition = new Vector(0, 0);
function handleMouseMove(event) {
    mousePosition = new Vector(event.pageX, event.pageY);
}
function GetAxis(TAxis, TKey) {
    if (TAxis = "h") {
        let xAxis = 0
        if (TKey == "k") {
            if (pressedKeys["a"])
                xAxis--;
            else if (pressedKeys["d"])
                xAxis++;
        }
        if (TKey == "a") {
            if (pressedKeys[left])
                xAxis--;
            else if (pressedKeys[right])
                xAxis++;
        }
        return xAxis;
    }
    if (TAxis = "v") {
        let yAxis = 0;
        if (TKey == "k") {
            if (pressedKeys["w"])
                yAxis--;
            else if (pressedKeys["s"])
                yAxis++;
        }
        if (TKey == "a") {
            if (pressedKeys[up])
                yAxis--;
            else if (pressedKeys[down])
                yAxis++;
        }
        return yAxis;
    }
    return 0;
}
function GetKey(keyCode) {
    if (keyCode in pressedKeys) {
        return pressedKeys[keyCode];
    } else {
        return false;
    }
}
function alpha(al) {
    return alphaValues[al];
}
function Collider(x, y, width, height, dirs) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.directions = dirs;
    this.colliderId = colliders.length;
    colliders.push(this);
    this.Update = function (newX, newY, newWidth, newHeight) {
        this.x = newX;
        this.y = newY;
        this.width = newWidth;
        this.height = newHeight;
    }
}
function lineWidth(w) {
    ctx.lineWidth = w;
}
function triangle(x, y, x1, y1, x2, y2) {

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
    if (fl) {
        ctx.fill();
    }
}
var alphaValues = [];
for (var i = 0; i < 255; i++) {
    i = Math.round(i * 100) / 100;
    var alpha = Math.round(i * 255);
    var hex = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();
    alphaValues.unshift(hex);
}
function shape(xPositions, yPositions) {
    ctx.beginPath();
    ctx.moveTo(xPositions[0], yPositions[0]);
    for (i = 1; i < xPositions.length; i++) {
        ctx.lineTo(xPositions[i], yPositions[i]);
    }
    ctx.lineTo([yPositions], yPositions[0]);
    ctx.closePath();
    ctx.stroke();
    if (fl) {
        ctx.fill();
    }
}
function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    if (fl) {
        ctx.fill();
    }
}
function ellipse(x, y, r) {
    r -= ctx.lineWidth / 2;
    var c = ctx.strokeStyle;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}
function fillRect(x, y, width, height) {
    ctx.fillRect(x, y, width, height);
}
function create(elem, id, cl) {
    var e = document.createElement(elem);
    e.setAttribute("id", id);
    e.setAttribute("class", cl);
    document.body.appendChild(e);
    return e;
}
function createSlider(min, max, step) {
    let slider = document.createElement("input");
    slider.type = "range";
    slider.min = min;
    slider.max = max;
    slider.step = step;
    document.body.appendChild(slider);
    return slider;
}
function createCanvas(w, h, colour, al) {
    if (al) {
        colour += alpha(al);
    }
    var canvas = document.createElement("canvas");
    canvas.width = w;
    console.log(canvas.width);
    CanvasWidth = w;
    CanvasHeight = h;
    canvas.height = h;
    canvas.style.backgroundColor = colour;
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    CanvasColor = colour;
    canvas.addEventListener("mouseover", function () { mouseOverCanvas = true; });
    canvas.addEventListener("mouseout", function () { mouseOverCanvas = false; });
    let el = canvas;
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    CanvasOffset = new Vector(_x, _y);
    return canvas;
}
function clear() {
    ctx.clearRect(-CanvasWidth * 5, -CanvasHeight * 5, CanvasWidth * 10, CanvasHeight * 10)
}
function point(x, y) {
    circle(x, y, ctx.lineWidth / 2);
}
function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.strokeRect(x, y, w, h);
    ctx.closePath();
    if (fl) {
        ctx.fillRect(x, y, w, h);
    }
}
var up = "ArrowUp";
var down = "ArrowDown";
var right = "ArrowRight";
var left = "ArrowLeft";
var keyCode;
if (window.setUp) {
    setUp();
}
function save() {
    ctx.save();
}
function restore() {
    ctx.restore();
}
var lastKey = 1;
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
function backGround(col, al) {
    var cl = ctx.fillStyle;
    if (al) {
        col += alphaValues[al];
    }
    ctx.fillStyle = col;
    ctx.fillRect(-CanvasWidth * 5, -CanvasHeight * 5, CanvasWidth * 10, CanvasHeight * 10);
    ctx.fillStyle = cl;
}
var FPS = 1;
if (window.draw) {
    draw();
    drawEnabled = true;
    drawInterval = setInterval(function () {
        if (drawEnabled)
            draw();
        frameNo += 1;

    }, 1000 / FPS);
}

function frameRate(fps) {
    clearInterval(0);
    drawEnabled = true;
    drawInterval = setInterval(function () {
        if (drawEnabled)
            draw();
        frameNo += 1;
    }, 1000 / fps);
    FPS = fps;
}
function line(x, y, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.stroke();
}
function stroke(col) {
    ctx.strokeStyle = col;
}
function nofill() {
    fl = false;
}
function fill(col) {
    fl = true;
    ctx.fillStyle = col;
}

function rotate(deg) {
    ctx.rotate(deg * Math.PI / 180);
    angle = angle + parseInt(deg);
    //console.log(angle);
}
function translate(x, y) {
    ctx.translate(x, y);
    translated.x += x;
    translated.y += y;
}
function Vector(x, y) {
    this.x = x;
    this.y = y;
    this.add = function (addition) {
        this.x += addition.x;
        this.y += addition.y;
    }
    this.mult = function (pow) {
        this.x *= pow;
        this.y *= pow;
    }
}
function RandomInt() {
    args = arguments;
    let r = 0;
    let a = 0;
    if (args.length > 1) {
        r = args[0];
        a = 1;
        args[1] -= args[0];
    }
    r += Math.round(Math.random() * args[a]);
    return r;
}
function Random() {
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
}