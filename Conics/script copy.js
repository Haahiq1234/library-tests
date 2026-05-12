/// <reference path='..\Canvas.js' />

let NUM_SCENARIOS = 0;

let scenario = -1;

let scenario_slider;
let scenario_show_button;

let max_x = 10;
let max_y = 10;

let slider_height = 40; //slider height in pixels
let sl;

function setUp() {
    if (!IsMobile()) {
        createCanvas(600, 600);
    } else {
        let cs = min(innerWidth, innerHeight);
        Gizmo.DEFAULTRADIUS = scale_x(20);
        createCanvas(cs, cs);
    }
    Camera2D.translate(CanvasWidth / 2, CanvasHeight / 2);
    Camera2D.zoom(CanvasWidth / (2 * max_x), CanvasWidth / 2, CanvasHeight / 2);
    Camera2D.scaleY *= -1;
    Gizmo.DEFAULTRADIUS = scale_x(+IsMobile() * 10 + 10);
    sl = scale_x(slider_height);
    let x = max_x - sl / 2;
    scenario_slider = new Slider(
        -x,
        -x,
        x,
        -x,
        0,
        NUM_SCENARIOS - 1,
        1,
        //NUM_SCENARIOS - 1,
    );
    scenario_slider.lineWidth = slider_height / 2;
    scenario_slider.layer = 1;
    scenario_slider.setShape(UI.RECT, sl, sl);
    scenario_slider.text((silder) => silder.value(1), 20);

    x = max_x - Gizmo.DEFAULTRADIUS;

    Gizmo.bounds = [-x, -x + sl, x, x];

    nofill();

    //frameRate(60);
}
function draw() {
    clear();

    //text(CanvasWidth, -max_x + sl, max_x - sl);
    //return;
    //console.log(scenarios_loaded, scenario);
    let new_scenario = scenario_slider.value(1);
    if (new_scenario != scenario) {
        unload_scenario();
        load_scenario(new_scenario);
    }
    draw_scenario(scenario);
}
function next_scenario() {
    return NUM_SCENARIOS++;
}

const scenarios_loaded = [];
const scenario_loaders = [];
const scenario_inits = [];
const scenario_draws = [];
const scenario_unloaders = [];
function load_scenario(n) {
    //console.log(n);
    if (!scenarios_loaded[n]) init_scenario(n);
    else scenario_loaders[n]();
    scenario = n;
}
function init_scenario(n) {
    scenario_inits[n]();
    scenarios_loaded[n] = true;
    UI.Relayer();
}
function unload_scenario() {
    if (scenario == -1) return;
    if (!scenarios_loaded[scenario]) {
        console.log("This is not supposed to happen.");
        return;
    }
    scenario_unloaders[scenario]();
}
function draw_scenario(n) {
    if (n == -1) return;
    if (!scenarios_loaded[n]) return;
    scenario_draws[n]();
}
function show_scenario() {
    if (!scenarios_loaded[scenario]) init_scenario(n);
    load_scenario(scenario);
}
function hide_scenario() {
    unload_scenario();
}
function scale_x(x) {
    return x / Camera2D.scaleX;
}
function scale_y(y) {
    return y / Camera2D.scaleY;
}
