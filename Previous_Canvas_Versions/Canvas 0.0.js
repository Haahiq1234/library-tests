

var ctx, width, height, colour, mouseOverCanvas, drawEnabled;
var fl = true;
var translated = createVector(0, 0);
var angle = 0;
var space = " ";
var frameNo = 0;
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
function quad(x, y, x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x, y);
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
function createCanvas(w, h, color) {
    var canvas = document.createElement("canvas");
    canvas.width = w;
    width = w;
    height = h;
    canvas.height = h;
    canvas.style.backgroundColor = color;
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    colour = color;
    canvas.addEventListener("mouseover", function () { mouseOverCanvas = true; });
    canvas.addEventListener("mouseout", function () { mouseOverCanvas = false; });
}
function clear() {
    let ang = angle;
    let x = translated.x;
    let y = translated.y;
    translate(-x, -y);
    rotate(-angle);
    ctx.clearRect(0, 0, width, height)
    translate(x, y);
    rotate(ang);
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
if (window.key_Down) {
    document.addEventListener("keydown", function (event) {
        keyCode = event.key;
        key_Down();
    });
}
if (window.key_Up) {
    document.addEventListener("keyup", function (event) {
        keyCode = event.key;
        key_Up();
    });
}
var FPS = 1;
if (window.draw) {
    draw();
    drawInterval = setInterval(function () {
        draw();
        frameNo += 1;
        drawEnabled = true;
    }, 1000 / FPS);
}

function frameRate(fps) {
    drawInterval = setInterval(function () {
        draw();
        frameNo += 1;
    }, 1000 / fps);
    FPS = fps;
    drawEnabled = true;
}
function startDraw() {
    drawInterval = setInterval(function () {
        draw();
        frameNo += 1;
    }, 1000 / FPS);
    drawEnabled = true;
}
function endDraw() {
    clearInterval(drawInterval);
    drawEnabled = false;
    console.log("why");
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
function createVector(x, y) {
    let self = {};
    self.x = x;
    self.y = y;
    return self;
}
