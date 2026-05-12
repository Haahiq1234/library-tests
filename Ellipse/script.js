/// <reference path='..\Canvas.js' />
/// <reference path='..\Scenario.js' />

let max_x = 10;
let max_y = 10;

function setUp() {
    createCanvas(600, 600);

    nofill();
    init_scenario_system();

    //frameRate(60);
}
function draw() {
    clear();

    //text(CanvasWidth, -max_x + sl, max_x - sl);
    update_scenario_system();
}
