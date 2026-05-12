/// <reference path='..\Canvas.js' />
/// <reference path='..\Scenario.js' />

{
    const scenario_id = next_scenario();
    let ellipseO = new Gizmo(0, 0);
    let ellipseA = new Gizmo(6, 0);
    let ellipseB = new Gizmo(0, 4);
    let pointP = new Gizmo(-5, 7);
    let pointQ = new Gizmo(-2, 7);

    ellipseO.text("O", 15);
    ellipseA.text("A", 15);
    ellipseB.text("B", 15);
    pointP.text("P", 15);
    pointQ.text("Q", 15);

    ellipseA.setParent(ellipseO);
    ellipseB.setParent(ellipseO);
    pointQ.setParent(pointP);

    ellipseA.onmove.bind((ell) => {
        ell.localPosition.y = 0;
    });
    ellipseB.onmove.bind((ell) => {
        ell.localPosition.x = 0;
    });

    scenario_loaders[scenario_id] = () => {
        ellipseO.Enable();
        ellipseA.Enable();
        ellipseB.Enable();
        pointP.Enable();
        pointQ.Enable();
    };
    scenario_unloaders[scenario_id] = () => {
        ellipseO.Disable();
        ellipseA.Disable();
        ellipseB.Disable();
        pointP.Disable();
        pointQ.Disable();
    };

    scenario_draws[scenario_id] = () => {
        let o = ellipseO.position;
        let a = ellipseA.localPosition.x;
        let b = ellipseB.localPosition.y;

        let tangents = tangents_from_point(
            o.x,
            o.y,
            a * a,
            b * b,
            pointP.x,
            pointP.y,
            //pointQ.localPosition.y / pointQ.localPosition.x,
        );
        for (let i in tangents) {
            lineFromEq(...tangents[i]);
        }
        ellipse(o.x, o.y, a, b);
    };
    function tangents_from_point(h, k, a1, b1, x, y) {
        x -= h;
        y -= k;
        let a = a1 - x * x;
        let b = 2 * x * y;
        let c = b1 - y * y;
        let ms = QuadraticFormula(a, b, c);
        let tangents = ms.map((m) => {
            return [m, -1, y - m * x - m * h + k];
        });
        return tangents;
    }
    function tangents_from_slope(h, k, a1, b1, m) {
        let disc = a1 * m * m + b1;
        if (disc > 0) {
            disc = Math.sqrt(disc);
            return [
                [m, -1, -m * h + k + disc],
                [m, -1, -m * h + k - disc],
            ];
        }
        return [];
    }
}
