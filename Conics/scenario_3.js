/// <reference path='..\Canvas.js' />
{
    const scenario_id = 3;
    let circle_AC;
    let circle_AR;
    let circle_BC;
    let circle_BR;

    scenario_loaders[scenario_id] = () => {
        if (!scenarios_loaded[scenario_id]) {
            circle_AC = new Gizmo(200, 150);
            circle_AR = new Gizmo(100, 150);
            circle_AC.setChild(circle_AR, true);

            circle_BC = new Gizmo(200, 300);
            circle_BR = new Gizmo(100, 300);
            circle_BC.setChild(circle_BR, true);
            scenarios_loaded[scenario_id] = true;
        } else {
            circle_AC.Enable();
            circle_AR.Enable();
            circle_BC.Enable();
            circle_BR.Enable();
        }
    }
    scenario_unloaders[scenario_id] = () => {
        if (!scenarios_loaded[scenario_id]) return;
        circle_AC.Disable();
        circle_AR.Disable();
        circle_BC.Disable();
        circle_BR.Disable();
    }

    on.draw.bind(() => {
        if (!scenarios_loaded[scenario_id] || scenario != scenario_id) return;
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
            lineFromEq(...ts[i])
        }
    });

    function common_circle_tangent(h1, k1, r1, h2, k2, r2) {
        let k3 = k1 - k2;
        let h3 = h2 - h1;
        let r3 = r2 - r1;

        let a = h3 * h3 - r3 * r3;
        let b = 2 * k3 * h3;
        let c = k3 * k3 - r3 * r3;

        let ms = QuadraticFormula(a, b, c);
        const tangents = [];
        for (let i = 0; i < ms.length; i++) {
            let m = ms[i];
            let a0 = r1 * Math.sqrt(1 + m * m);
            let a1 = k1 - m * h1;
            tangents.push([m, -1, a1 + a0]);
            tangents.push([m, -1, a1 - a0]);
        }
        return tangents;
    }
}