/// <reference path='..\Canvas.js' />


// Getting two points and a tangent to the circle at the second point
//
{
    const scenario_id = 4;
    let pointA;
    let pointB;
    let line_control;

    scenario_loaders[scenario_id] = () => {
        if (!scenarios_loaded[scenario_id]) {
            pointA = new Gizmo(200, 300);
            pointB = new Gizmo(400, 400);
            line_control = new Gizmo(300, 500);
            line_control.setParent(pointB, true);
            scenarios_loaded[scenario_id] = true;
        } else {
            pointA.Enable();
            pointB.Enable();
            line_control.Enable();
        }
    }
    scenario_unloaders[scenario_id] = () => {
        if (!scenarios_loaded[scenario_id]) return;
        pointA.Disable();
        pointB.Disable();
        line_control.Disable();
    }

    on.draw.bind(() => {
        if (!scenarios_loaded[scenario_id] || scenario != scenario_id) return;
        const [a, b, c] = getLineEq(pointB.x, pointB.y, line_control.x, line_control.y);
        lineFromEq(a, b, c);
        const [h, k, r] = solve_scenario_5(
            pointA.x, pointA.y,
            pointB.x, pointB.y,
            a, b, c
        );
        circle(h, k, r);
    });

    function solve_scenario_5(x1, y1, x2, y2, a, b, c) {
        if (a == 0) {
            if (y1 == y2) {
                console.log("Points all lie on a horizontal line which is also the tangent line.");
                return [(x1 + x2) / 2, y1, Math.abs(x1 - x2)];
            }
            let k = ((x1 - x2) ** 2 + y1 * y1 - y2 * y2) / (2 * (y1 - y2));
            return [x2, k, dist(x1, y1, x2, k)];
        }
        if ((a * x1 + b * x2 + c) == 0) {
            console.log("Both points lie on tangent line meaning tangent line is basically normal line");
        }
        let a1 = 2 * (x2 - x1);
        let b1 = 2 * (y2 - y1);
        let c1 = x1 * x1 + y1 * y1 - x2 * x2 - y2 * y2;
        let h = (b * b1 * x2 - a * b1 * y2 - a * c1) / (a * a1 + b * b1);
        let k = (b * h + a * y2 - b * x2) / a;
        return [h, k, dist(h, k, x1, y1)];
    }
}