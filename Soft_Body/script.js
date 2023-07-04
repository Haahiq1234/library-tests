const softBody = new SoftBody(50, 50);
const menu = new Menu();
var mousePressedAgain = false;

function setUp() {
    if (IsMobile()) {
        createCanvas(innerWidth, innerWidth);
    } else {
        createCanvas(500, 500);
    }
    menu.init();

    menu.ca
    fill(255, 0, 0);
    lineWidth(2);
}
function draw() {
    clear();
    if (menu.enabled) {
        menu.update();
    } else {
        softBody.addForce(new Vector2(GetAxis("horizontal") * 4, 0));

        softBody.update();
    }
}
function key_Press() {
    if (menu.enabled) return;
    if (keyCode == key.space) {
        softBody.addForce(new Vector2(0, -200));
    }

}
function key_Down() {
    //console.log(keyCode);
}
on.pointerup.bind(function (x, y, px, py) {
    if (menu.enabled) return;
    let dx = x - px;
    let dy = y - py;
    //if (-dy > abs(dx)) {
    softBody.addForce(new Vector2(dx, dy));
    //}
});