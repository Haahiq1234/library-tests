/// <reference path='..\Canvas.js' />
/// <reference path='..\Scenario.js' />

{
    const scenario_id = next_scenario();
    let pointA = new Gizmo(5, 0);
    let pointB = new Gizmo(-4, -3);
    let pointC = new Gizmo(0, 4);

    pointA.text("A", 15);
    pointB.text("B", 15);
    pointC.text("C", 15);

    scenario_loaders[scenario_id] = () => {
        pointA.Enable();
        pointB.Enable();
        pointC.Enable();
    };
    scenario_unloaders[scenario_id] = () => {
        pointA.Disable();
        pointB.Disable();
        pointC.Disable();
    };

    scenario_draws[scenario_id] = () => {
        let a = pointA.position;
        let b = pointB.position;
        let c = pointC.position;
    };
    function ellipse_from_three_points(a, b, c, d, e, f) {}
}
