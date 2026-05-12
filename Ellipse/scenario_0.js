/// <reference path='..\Canvas.js' />

{
    const scenario_id = next_scenario();
    const ellipse_C = new Gizmo(0, 0);
    const pointA = new Gizmo(5, 0);
    const pointB = new Gizmo(0, -6);
    let pointP = new Gizmo(5, 7);
    //let pointQ = new Gizmo(-2, 7);

    pointA.text("A", 15);
    pointB.text("B", 15);
    ellipse_C.text("E", 15);
    pointP.text("P", 15);
    //pointQ.text("Q", 15);

    //pointQ.setParent(pointP);

    scenario_loaders[scenario_id] = () => {
        ellipse_C.Enable();
        pointA.Enable();
        pointB.Enable();
        pointP.Enable();
        //pointQ.Enable();
    };
    scenario_unloaders[scenario_id] = () => {
        pointA.Disable();
        pointB.Disable();
        ellipse_C.Disable();
        pointP.Disable();
        //pointQ.Disable();
    };
    function split_line_x(x, y1, y2) {
        if (y2 < y1) {
            let t = y2;
            y2 = y1;
            y1 = t;
        }
        line(x, -10, x, y1);
        line(x, y2, x, 10);
    }
    function split_line_y(y, x1, x2) {
        if (x2 < x1) {
            let t = x2;
            x2 = x1;
            x1 = t;
        }
        line(-10, y, x1, y);
        line(x2, y, 10, y);
    }

    scenario_draws[scenario_id] = () => {
        //ellipse(0, 0, 1, 2);
        let h = ellipse_C.x;
        let k = ellipse_C.y;
        let c = pointA.x;
        let d = pointA.y;
        let e = pointB.x;
        let f = pointB.y;

        // let c1 = 2 * h - c;
        // let d1 = 2 * k - d;
        // split_line_y(d1, c, c1);
        // split_line_y(d, c, c1);
        // split_line_x(c1, d, d1);
        // split_line_x(c, d, d1);

        // let e1 = 2 * h - e;
        // let f1 = 2 * k - f;

        // split_line_y(f1, e, e1);
        // split_line_y(f, e, e1);
        // split_line_x(e1, f, f1);
        // split_line_x(e, f, f1);

        //rect(c, d, c1 - c, d1 - d);
        //circle(c1, d1, 0.5);
        //hyperbola_2(0, 0, 4, -1);
        const [a, b] = get_conic_ab(h, k, c, d, e, f);
        if (a < 0 || b < 0) {
            hyperbola_3(h, k, a, b);
        } else {
            ellipse(h, k, a ** 0.5, b ** 0.5);
        }

        // let ln = getLineEq(pointP.x, pointP.y, pointQ.x, pointQ.y);
        // lineFromEq(...ln);

        let tangents = tangents_from_point(
            h,
            k,
            a,
            b,
            pointP.x,
            pointP.y,
            //pointQ.localPosition.y / pointQ.localPosition.x,
        );
        for (let i in tangents) {
            lineFromEq(...tangents[i]);
        }
    };

    function get_conic_ab(h, k, c, d, e, f) {
        let c1 = (c - h) ** 2;
        let d1 = (d - k) ** 2;
        let e1 = (e - h) ** 2;
        let f1 = (f - k) ** 2;
        if (c1 - e1 == 0 || f1 - d1 == 0) {
            return [0, 0];
        }
        let num = f1 * c1 - e1 * d1;
        let a1 = num / (f1 - d1);
        let b1 = -num / (e1 - c1);
        return [a1, b1];
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
        if (a == 0) {
            tangents.push([1, 0, -h - Math.sqrt(Math.abs(a1))]);
        }
        return tangents;
    }
    function hyperbola_3(h, k, a_2, b_2, res = 5) {
        //console.log((pointA.x - h) ** 2 / a_2 + (pointA.y - k) ** 2 / b_2);
        [h, k] = Camera2D.convertPos(h, k);
        a_2 *= Math.abs(Camera2D.scaleX) ** 2;
        b_2 *= Math.abs(Camera2D.scaleY) ** 2;
        ctx.beginPath();
        if (b_2 < 0) {
            let beginning_x_off = Math.sqrt((1 - (0 - k) ** 2 / b_2) * a_2);

            ctx.moveTo(h + beginning_x_off, 0);
            for (let y = 0; y <= CanvasHeight; y += res) {
                let x = h + Math.sqrt((1 - (y - k) ** 2 / b_2) * a_2);
                if (isNaN(x)) continue;
                ctx.lineTo(x, y);
            }
            ctx.moveTo(h - beginning_x_off, 0);
            for (let y = 0; y <= CanvasHeight; y += res) {
                let x = h - Math.sqrt((1 - (y - k) ** 2 / b_2) * a_2);
                if (isNaN(x)) continue;
                ctx.lineTo(x, y);
            }
            ctx.moveTo(0, 0);
        }
        if (a_2 < 0) {
            //console.log("Yes");
            let beginning_y_off = Math.sqrt((1 - (0 - h) ** 2 / a_2) * b_2);

            ctx.moveTo(0, k + beginning_y_off);
            for (let x = 0; x <= CanvasWidth; x += res) {
                let y = k + Math.sqrt((1 - (x - h) ** 2 / a_2) * b_2);
                if (isNaN(y)) continue;
                ctx.lineTo(x, y);
            }
            ctx.moveTo(0, k - beginning_y_off);
            for (let x = 0; x <= CanvasWidth; x += res) {
                let y = k - Math.sqrt((1 - (x - h) ** 2 / a_2) * b_2);
                if (isNaN(y)) continue;
                ctx.lineTo(x, y);
            }
            ctx.moveTo(0, 0);
        }
        ctx.closePath();
        ctx.stroke();
    }
}
