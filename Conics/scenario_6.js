/// <reference path='..\Canvas.js' />

{
    const scenario_id = next_scenario();
    let pointA;
    let pointB;
    let pointC;

    scenario_inits[scenario_id] = () => {
        pointA = new Gizmo(2, 0);
        pointB = new Gizmo(0, 0);
        pointC = new Gizmo(0, 3);
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
        let c = three_points_to_circle(
            pointA.x,
            pointA.y,
            pointB.x,
            pointB.y,
            pointC.x,
            pointC.y,
        );
        circle(c[0], c[1], c[2]);
    };

    function three_points_to_circle(ax, ay, bx, by, cx, cy) {
        line(ax, ay, bx, by);
        line(ax, ay, cx, cy);
        line(bx, by, cx, cy);

        let a = dist(bx, by, cx, cy);
        let b = dist(ax, ay, cx, cy);
        let c = dist(ax, ay, bx, by);
        //circle(c, d, 1);

        let h = (a * ax + b * bx + c * cx) / (a + b + c);
        let k = (a * ay + b * by + c * cy) / (a + b + c);

        return [h, k, distance.line(ax, ay, bx, by, h, k, true)];
    }
}
