/// <reference path='..\Scenario.js' />
/// <reference path='..\Canvas.js' />
{
    const scenario_id = next_scenario();
    let circle_AC = new Gizmo(5, 0);
    let circle_AR = new Gizmo(5, 2);
    circle_AC.setChild(circle_AR, true);

    let circle_BC = new Gizmo(-5, 0);
    let circle_BR = new Gizmo(-5, -2);
    circle_BC.setChild(circle_BR, true);


    scenario_loaders[scenario_id] = () => {
        circle_AC.Enable();
        circle_AR.Enable();
        circle_BC.Enable();
        circle_BR.Enable();
    };
    scenario_unloaders[scenario_id] = () => {
        circle_AC.Disable();
        circle_AR.Disable();
        circle_BC.Disable();
        circle_BR.Disable();
    };

    scenario_draws[scenario_id] = () => {
        let h1 = circle_AC.x;
        let k1 = circle_AC.y;
        let r1 = Vector.dist(circle_AC, circle_AR);
        circle(h1, k1, r1);

        let h2 = circle_BC.x;
        let k2 = circle_BC.y;
        let r2 = Vector.dist(circle_BC, circle_BR);
        circle(h2, k2, r2);

        let ts = common_circle_tangent(h1, k1, r1, h2, k2, r2);
        //console.log(ts);
        for (let i = 0; i < ts.length; i++) {
            lineFromEq(...ts[i]);
        }
    };

    function common_circle_tangent(h1, k1, r1, h2, k2, r2) {
        if (r2 < r1) [h1, k1, r1, h2, k2, r2] = [h2, k2, r2, h1, k1, r1];


        let h3 = h2 - h1;
        let k3 = k1 - k2;
        let r3 = r2 - r1;
        let r4 = r2 + r1;

        const tangents = [];
        if (h3 == 0) {

        } else {
            get_tangents_abs(h1, k1, r1, h2, k2, r2, h3, k3, r3, tangents);
            get_tangents_abs(h1, k1, r1, h2, k2, r2, h3, k3, r4, tangents);
        }


        return tangents;
    }
    function get_tangents_abc(h1, k1, r1, h2, k2, r2, h3, k3, r3, tangents) {

        let a = h3 * h3 - r3 * r3;
        let b = 2 * k3 * h3;
        let c = k3 * k3 - r3 * r3;

        let ms = (a == 0) ? [0, -c / b] : QuadraticFormula(a, b, c);
        for (let i = 0; i < ms.length; i++) {
            let m = ms[i];
            let a0 = r1 * Math.sqrt(1 + m * m);
            let a1 = k1 - m * h1;
            add_if_tangent(tangents, h1, k1, r1, h2, k2, r2, [m, -1, a1 + a0]);
            add_if_tangent(tangents, h1, k1, r1, h2, k2, r2, [m, -1, a1 - a0]);
        }
    }
    function add_if_tangent(tans, h1, k1, r1, h2, k2, r2, t) {
        if (is_circle_tangent(h1, k1, r1, t) && is_circle_tangent(h2, k2, r2, t)) tans.push(t);
    }
    function is_circle_tangent(h, k, r, [a, b, c]) {
        let dist = Math.abs(a * h + b * k + c) / Math.sqrt(a * a + b * b);
        return Math.abs(dist - r) < (EPSILON / 10);
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
