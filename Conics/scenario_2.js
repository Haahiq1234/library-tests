/// <reference path='..\Canvas.js' />
{
    const scenario_id = next_scenario();
    let circle_C;
    let circle_R;
    let point_P;

    scenario_inits[scenario_id] = () => {
        circle_C = new Gizmo(0, 0);
        circle_R = new Gizmo(3, 0);
        circle_C.setChild(circle_R, true);
        point_P = new Gizmo(-6, 2);
    };

    scenario_loaders[scenario_id] = () => {
        circle_C.Enable();
        circle_R.Enable();
        point_P.Enable();
    };
    scenario_unloaders[scenario_id] = () => {
        circle_C.Disable();
        circle_R.Disable();
        point_P.Disable();
    };

    scenario_draws[scenario_id] = () => {
        let cx = circle_C.x;
        let cy = circle_C.y;
        let radius = Vector.dist(circle_C, circle_R);
        circle(cx, cy, radius);

        let px = point_P.x;
        let py = point_P.y;
        let ts = tangents_of_circle(cx, cy, radius, px, py);
        //console.log(ts);
        for (let i = 0; i < ts.length; i++) {
            lineFromEq(...ts[i]);
        }
    };

    function chord_of_circle_from_tangent_intersections(h, k, r, x1, y1) {
        let x2 = x1 - h;
        let y2 = y1 - k;
        let c = -x2 * h - y2 * k - r * r;
        return [[x2, y2, c]];
    }
    function tangents_of_circle(h, k, r, x1, y1) {
        let x2 = h - x1;
        let y2 = k - y1;

        let a = x2 * x2 - r * r;
        let b = -2 * x2 * y2;
        let c = y2 * y2 - r * r;

        let tangents;
        if (a == 0) {
            let m1 = -c / b;
            tangents = [
                [m1, -1, y1 - m1 * x1],
                [1, 0, -x1],
            ];
        } else {
            let ms = QuadraticFormula(a, b, c);
            tangents = ms.map((m) => {
                return [m, -1, y1 - m * x1];
            });
        }

        //console.log(a, b, c);
        // if (dist(x1, y1, h, k) >= r) {
        //     tangents.push([-x2, -y2, h * x2 + k * y2 - r * r]);
        // }

        return tangents;
    }
}
