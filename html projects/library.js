var ctx, width, height, colour;
var fl = true;
var translated = createVector(0,0);
var angle = 0;
function create(elem,id,cl) {
 var e = document.createElement(elem);
 e.setAttribute("id", id);
 e.setAttribute("class", cl);
 document.body.appendChild(e);
 return e;
}

function createSlider(min,max,step) {
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
}
function reset() {
  translate(-translated.x,-translated.y);
  rotate(-angle);
  console.log([translated,angle]);
}
function clear() {
  let ang = angle;
  let x = translated.x;
  let y = translated.y;
  translate(translated.x,translated.y);
  rotate(-angle);
  fill(colour);
  console.log([translated,angle]);
  rect(0,0,width,height);
  nofill();
  translate(-x,-y);
  rotate(ang);
}

function rect(x,y,w,h) {
  if (!fl) {
    ctx.strokeRect(x, y, w, h);
  } else if (fl) {
    ctx.fillRect(x, y, w, h);
  }
}
var up ="ArrowUp";
var down ="ArrowDown";
var right ="ArrowRight";
var left ="ArrowLeft";
var keyCode;
if (window.setUp) {
  setUp();
}
if (window.key_Down) {
  document.addEventListener("keydown",function (event) {
    keyCode = event.key;
    key_Down();
  });
}
if (window.draw) {
  draw();
  drawInterval = setInterval(draw, 1000);
}
function frameRate(fps) {
  drawInterval = setInterval(draw, 1000/fps);
}
function line(x,y,x1,y1) {
  ctx.moveTo(x,y);
  ctx.lineTo(x1,y1);
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
  ctx.rotate(deg*Math.PI/180);
  angle = angle + parseInt(deg);
}

function translate(x,y) {
  ctx.translate(x,y);
  translated.x += x;
  translated.y += y;
}
function createVector(x,y) {
  let self = {};
  self.x = x;
  self.y = y;
  return self;
}
