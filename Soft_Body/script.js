const softBody = new SoftBody(50, 50);
const menu = new Menu();

function setUp() {
    createCanvas(600, 400);
    menu.init();
    fill(255, 0, 0);
    lineWidth(2);
}
function draw() {
    clear();
    if (menu.enabled) {
        menu.update();
    } else {
        softBody.update();
    }
}