/// <reference path='..\Canvas.js' />
/// <reference path='..\Scenario.js' />

{
    const scenario_id = next_scenario();
    let pointF1 = new Gizmo(5, 0);
    let pointF2 = new Gizmo(-4, -3);
    let pointP = new Gizmo(0, 4);

    pointF1.text("F1", 15);
    pointF2.text("F2", 15);
    pointP.text("P", 15);

    scenario_loaders[scenario_id] = () => {
        pointF1.Enable();
        pointF2.Enable();
        pointP.Enable();
    };
    scenario_unloaders[scenario_id] = () => {
        pointF1.Disable();
        pointF2.Disable();
        pointP.Disable();
    };

    scenario_draws[scenario_id] = () => {
        let f1 = pointF1.position;
        let f2 = pointF2.position;
        let p = pointP.position;
        draw_ellipse_from_foci(f1.x, f1.y, f2.x, f2.y, p.x, p.y);
    };
    function draw_ellipse_from_foci(f1x, f1y, f2x, f2y, px, py) {
        let cen = new Vector2((f1x + f2x) / 2, (f1y + f2y) / 2);
        let c = dist(f1x, f1y, f2x, f2y) / 2;
        let a = (dist(f1x, f1y, px, py) + dist(f2x, f2y, px, py)) / 2;
        let b = Math.sqrt(a * a - c * c);
        let ang = atan2(f1y - cen.y, f1x - cen.x);
        push();
        //Camera2D.translate(cen.x, cen.y);
        //console.log(center.x, center.y, a, b, c);
        ellipse(cen.x, cen.y, a, b, -ang);
        //Camera2D.translate(-cen.x, -cen.y);
    }
}
