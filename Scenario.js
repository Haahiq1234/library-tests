/// <reference path='Canvas.js' />
let NUM_SCENARIOS = 0;

let scenario = -1;

let scenario_slider;
let scenario_show_button;

let scenario_controls_visible = true;

let max_xy;

let sl;

function init_scenario_system(
    _max_xy = 10,
    slider_height = 40,
    default_n = 0, //NUM_SCENARIOS - 1,
) {
    max_xy = _max_xy;
    Camera2D.translate(CanvasWidth / 2, CanvasHeight / 2);
    Camera2D.zoom(
        CanvasWidth / (2 * max_xy),
        CanvasWidth / 2,
        CanvasHeight / 2,
    );
    Camera2D.scaleY *= -1;
    Gizmo.SETALLRADIUS(pixels_to_screen_space(+IsMobile() * 10 + 10));
    Gizmo.DEFAULTRADIUS = pixels_to_screen_space(+IsMobile() * 10 + 10);
    sl = pixels_to_screen_space(slider_height);
    let x = max_xy - sl / 2;
    scenario_slider = new Slider(
        -x,
        -x,
        x - sl,
        -x,
        0,
        NUM_SCENARIOS - 1,
        default_n,
        //NUM_SCENARIOS - 1,
    );
    scenario_show_button = new Button(x, -x, sl, sl);
    scenario_show_button.text("X", 20);
    scenario_show_button.onclick.bind(function () {
        if (scenario_controls_visible) {
            hide_scenario();
        } else {
            show_scenario();
        }
    });
    scenario_slider.lineWidth = slider_height / 2;
    scenario_slider.layer = 1;
    scenario_slider.setShape(UI.RECT, sl, sl);
    scenario_slider.text((silder) => silder.value(1), 20);

    x = max_xy - Gizmo.DEFAULTRADIUS;

    Gizmo.bounds = [-x, -x + sl, x, x];

    for (let i = 0; i < NUM_SCENARIOS; i++) {
        if (scenario_inits[i]) {
            scenarios_loaded[i] = false;
        } else {
            scenarios_loaded[i] = true;
        }
        scenario_unloaders[i]();
    }
}
function update_scenario_system() {
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
    scenario = n;
    if (!scenarios_loaded[n]) init_scenario(n);
    else if (scenario_controls_visible) show_scenario();
}
function init_scenario(n) {
    if (scenario_inits[n]) scenario_inits[n]();
    scenarios_loaded[n] = true;
    UI.Relayer();
    if (!scenario_controls_visible) {
        hide_scenario();
    }
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
    scenario_loaders[scenario]();
    scenario_controls_visible = true;
}
function hide_scenario() {
    unload_scenario();
    scenario_controls_visible = false;
}
function pixels_to_screen_space(x) {
    return x / Camera2D.scaleX;
}
