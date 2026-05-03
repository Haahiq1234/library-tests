/// <reference path='..\Canvas.js' />

{
    const scenario_id = next_scenario();
    let circle_A;
    let circle_B;
    let line_A;
    let line_B;

    scenario_inits[scenario_id] = function () {
        circle_A = new Gizmo(2, 0);
        circle_B = new Gizmo(2, 2);
        line_A = new Gizmo(-2, 0);
        line_B = new Gizmo(0, -3);
        line_B.setParent(line_A, true);
    };

    scenario_loaders[scenario_id] = function () {
        circle_A.Enable();
        circle_B.Enable();
        line_A.Enable();
        line_B.Enable();
    };
    scenario_unloaders[scenario_id] = function () {
        circle_A.Disable();
        circle_B.Disable();
        line_A.Disable();
        line_B.Disable();
    };

    scenario_draws[scenario_id] = () => {
        const [a, b, c] = getLineEq(line_A.x, line_A.y, line_B.x, line_B.y);
        lineFromEq(a, b, c);

        let cs = getCirclesFromScenario1(
            circle_A.x,
            circle_A.y,
            circle_B.x,
            circle_B.y,
            a,
            b,
            c,
        );
        for (let i = 0; i < cs.length; i++) {
            circle(cs[i][0], cs[i][1], cs[i][2]);
        }
    };
    function getCirclesFromScenario1(x1, y1, x2, y2, a, b, c) {
        let a1 = 2 * (x2 - x1);
        let b1 = 2 * (y2 - y1);
        let c1 = x1 * x1 - x2 * x2 + y1 * y1 - y2 * y2;
        let ab_sq = a * a + b * b;
        //lineFromEq(a1, b1, c1);

        if (a1 == 0) {
            let k = -c1 / b1;

            let t = (y1 - k) ** 2;
            let s = c + b * k;

            let a2 = ab_sq - a * a;
            let b2 = -2 * (ab_sq * x1 + a * s);
            let c2 = ab_sq * (x1 * x1 + t) - s * s;
            let hs = QuadraticFormula(a2, b2, c2);
            let cs = hs.map((h) => [h, k, dist(h, k, x1, y1)]);
            //line(-10, k, 10, k);
            return cs;
        }

        let a2 = b1 * b1 + a1 * a1;
        let b2 = 2 * x1 * a1 * b1 + 2 * b1 * c1 - 2 * y1 * a1 * a1;
        let c2 = (y1 * y1 + x1 * x1) * a1 * a1 + c1 * c1 + 2 * x1 * a1 * c1;
        let d2 = a1 * b - b1 * a;
        let e2 = a1 * c - c1 * a;

        let a3 = ab_sq * a2 - d2 * d2;
        let b3 = ab_sq * b2 - 2 * d2 * e2;
        let c3 = ab_sq * c2 - e2 * e2;

        let ks = QuadraticFormula(a3, b3, c3);
        let cs = ks.map((k) => {
            let h = (-b1 * k - c1) / a1;
            return [h, k, dist(h, k, x1, y1)];
        });
        // for (let k in ks) {
        //     line(-10, k, 10, k);
        // }
        return cs;
    }
}
