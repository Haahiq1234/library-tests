/// <reference path='..\Canvas.js' />

let max_x = 10;
let max_y = 10;

let slider_height = 40; //slider height in pixels

function setUp() {
    createCanvas(600, 600);
    init_scenario_system(10, 40, 0);
    nofill();
    //frameRate(60);
}
function draw() {
    clear();

    //text(CanvasWidth, -max_x + sl, max_x - sl);
    //return;
    //console.log(scenarios_loaded, scenario);
    update_scenario_system();
}
