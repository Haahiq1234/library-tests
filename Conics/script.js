/// <reference path='..\Canvas.js' />

const NUM_SCENARIOS = 5;


let scenario = -1;

let scenario_slider;
let scenario_show_button;

function setUp() {
    if (!IsMobile()) {
        createCanvas(600, 600);
    } else {
        let cs = min(innerWidth, innerHeight);
        Gizmo.DEFAULTRADIUS = 20;
        createCanvas(cs, cs);
    }

    scenario_slider = new Slider(
        25, CanvasHeight - 25, CanvasWidth - 25, CanvasHeight - 25,
        0, NUM_SCENARIOS - 1, 2);
    scenario_slider.lineWidth = 25;
    scenario_slider.layer = 1;
    scenario_slider.setShape(UI.RECT, 50, 50);
    scenario_slider.text(silder => silder.value(1), 20);

    Gizmo.bounds = [
        Gizmo.DEFAULTRADIUS, Gizmo.DEFAULTRADIUS,
        CanvasWidth - Gizmo.DEFAULTRADIUS, CanvasHeight - 50 - Gizmo.DEFAULTRADIUS];

    nofill();

    //frameRate(60);
}
function draw() {
    clear();

    text(CanvasWidth, 10, 10);
    //console.log(scenarios_loaded, scenario);
    let new_scenario = scenario_slider.value(1);
    if (new_scenario != scenario) {
        unload_scenario();
        load_scenario(new_scenario);
    }
}


const scenarios_loaded = [];
const scenario_loaders = [];
const scenario_unloaders = [];
function load_scenario(n) {
    //console.log(n);
    scenario_loaders[n]();
    UI.Relayer();
    scenario = n;
}
function unload_scenario(n) {
    if (scenario == -1) return;
    scenario_unloaders[scenario]();
}
function show_scenario() {
    load_scenario(scenario);
}
function hide_scenario() {
    unload_scenario();
}