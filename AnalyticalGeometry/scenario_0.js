/// <reference path='..\Canvas.js' />
/// <reference path='..\Scenario.js' />

{
    const scenario_id = next_scenario();
    let pointA;
    let pointB;
    let pointC;

    scenario_inits[scenario_id] = () => {
        pointA = new Gizmo(2, 0);
        pointB = new Gizmo(0, 0);
        pointC = new Gizmo(0, 3);

        // pointC.setParent(pointB);
        // pointB.setParent(pointA);

        pointA.setParent(pointB);
        pointC.setParent(pointB);

        pointA.text("A", 15);
        pointB.text("B", 15);
        pointC.text("C", 15);
    };
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

        line(a.x, a.y, b.x, b.y);
        line(c.x, c.y, b.x, b.y);

        let d = Vector.sub(Vector.add(c, a), b);
        line(c.x, c.y, d.x, d.y);
        line(a.x, a.y, d.x, d.y);
    };
}
