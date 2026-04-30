/// <reference path='..\Canvas.js' />
{
    const scenario_id = 2;
    let circle_C;
    let circle_R;
    let point_P;

    scenario_loaders[scenario_id] = () => {
        if (!scenarios_loaded[scenario_id]) {
            circle_C = new Gizmo(200, 200);
            circle_R = new Gizmo(100, 200);
            circle_C.setChild(circle_R, true);
            point_P = new Gizmo(300, 300);
            scenarios_loaded[scenario_id] = true;
        } else {
            circle_C.Enable();
            circle_R.Enable();
            point_P.Enable();
        }
    }
    scenario_unloaders[scenario_id] = () => {
        if (!scenarios_loaded[scenario_id]) return;
        circle_C.Disable();
        circle_R.Disable();
        point_P.Disable();
    }

    on.draw.bind(() => {
        if (scenario != scenario_id || !scenarios_loaded[scenario_id]) return;
        let cx = circle_C.x;
        let cy = circle_C.y;
        let radius = Vector.dist(circle_C, circle_R);
        circle(cx, cy, radius);

        let px = point_P.x;
        let py = point_P.y;
        let ts = tangents_of_circle(cx, cy, radius, px, py);
        //console.log(ts);
        for (let i = 0; i < ts.length; i++) {
            lineFromEq(...ts[i])
        }
    });

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
            let m1 = - c / b;
            tangents = [[m1, -1, y1 - m1 * x1], [1, 0, -x1]];
        } else {
            let ms = QuadraticFormula(a, b, c);
            tangents = ms.map((m) => { return [m, -1, y1 - m * x1]; });
        }

        //console.log(a, b, c);
        if (dist(x1, y1, h, k) >= r) {
            tangents.push([-x2, -y2, h * x2 + k * y2 - r * r]);
        }

        return tangents;
    }
}