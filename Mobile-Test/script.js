// document.ontouchstart = function (event) {
//     fill(255, 0, 0);
//     circle(event.touches[0].clientX, event.touches[0].clientY, 10);
// }
// document.ontouchmove = function (event) {
//     fill(0, 255, 0);
//     circle(event.touches[0].clientX, event.touches[0].clientY, 10);
// }
// document.ontouchend = function (event) {
//     fill(0, 0, 255);
//     circle(event.touches[0].clientX, event.touches[0].clientY, 10);
// }
function setUp() {
    createCanvas(400, 400);
    frameRate(60);
}
function draw() {
    //clear();
    fill(255, 0, 0);
    circle(mouse.x, mouse.y, 5)
}