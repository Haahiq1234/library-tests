const softBody = new SoftBody(50, 50);
const menu = new Menu();

function setUp() {
    createCanvas(min(window.innerWidth, 400), 500);
    menu.init();
    fill(255, 0, 0);
    lineWidth(2);
}
function draw() {
    clear();
    if (menu.enabled) {
        menu.update();
    } else {
        softBody.addForce(new Vector2(GetAxis("horizontal") * 2, 0));
        softBody.update();
    }
}
function key_Press() {
    if (menu.enabled) return;
    if (keyCode == key.space) {
        softBody.addForce(new Vector2(0,-200));
    }
    
}
on.mouseup.bind(function(x, y, dx, dy) {
    noLoop();
    line(x, y, x - dx, y - dy);
});